import React from "react";
import PropTypes from "prop-types";

// GraphQL
import { DOCS_SEARCH } from "../../../queries";

// MUI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";

import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

// Utils
import { withPageBlockEditorkUtils } from "../../../.common/BlockUtils";

// Components
import GraphQLLazyQuery from "../../../.common/GraphQLLazyQuery";
import {
  MainContainer,
  SearchResults,
  SearchField,
  SelectedFilesContainer,
} from "./styles";

const Settings = (props) => {
  const { onContentUpdate, hideEditorDraw, options, theme } = props;

  // Hooks
  const loadRequested = React.useRef();
  const updates_commited = React.useRef(false);
  const dragged_item = React.useRef(null);
  const search_timeout = React.useRef();

  const [search_focus, setSearchFocus] = React.useState(false);
  const [search_str, setSearchStr] = React.useState("");
  const [search_list, setSearchList] = React.useState([]);
  const [selected_files, setSelectedFiles] = React.useState(null);

  let getFiles = () => {};

  React.useEffect(() => {
    if (!selected_files || updates_commited.current) {
      updates_commited.current = false;
      setSelectedFiles([...options.files]);
    }
  }, [options.files, selected_files]);

  // Handlers
  const onSearchInput = (e) => {
    const new_str = e.target.value;

    if (search_str !== new_str) {
      setSearchStr(new_str);

      if (search_timeout.current) clearTimeout(search_timeout.current);

      search_timeout.current = setTimeout(() => {
        if (new_str.length > 0)
          getFiles({ variables: { key: `%%${new_str}%` } });
        else setSearchList([]);
      }, 500);
    }
  };

  const onClearSearch = (e) => {
    setSearchStr("");
    setSearchList([]);
  };

  const onSearchSelect = (file) => (e) => {
    if (!selected_files.find((item) => item.id === file.id)) {
      setSelectedFiles([...selected_files, { ...file }]);

      updates_commited.current = false;
    }
  };

  const onFileDelete = (file) => (e) => {
    const delete_index = selected_files.findIndex(
      (item) => item.id === file.id
    );
    const new_selected_files = [...selected_files];

    if (delete_index > -1) {
      new_selected_files.splice(delete_index, 1);

      setSelectedFiles(new_selected_files);

      updates_commited.current = false;
    }
  };

  const onAddFiles = (e) => {
    onContentUpdate("files", [...selected_files]);

    updates_commited.current = true;

    hideEditorDraw();
  };

  const onDragStart = (index) => (e) => {
    dragged_item.current = selected_files[index];

    const chip = e.target.querySelector(".MuiChip-root");

    e.dataTransfer.setData("text/html", chip);
    e.dataTransfer.setDragImage(chip, 15, 15);
  };

  const onDragEnd = (index) => (e) => {};

  const onDragEnter = (index) => (e) => {
    const draggedOverItem = selected_files[index];

    if (dragged_item.current !== draggedOverItem) {
      let items = selected_files.filter(
        (item) => item !== dragged_item.current
      );

      items.splice(index, 0, dragged_item.current);

      setSelectedFiles(items);

      updates_commited.current = false;
    }
  };

  // Render
  return (
    <MainContainer theme={theme}>
      <GraphQLLazyQuery
        setQueryTrigger={(trigger) => {
          getFiles = trigger;
        }}
        QUERY={DOCS_SEARCH}
        completeCb={(data) => {
          loadRequested.current = false;

          setSearchList(data.documentList || []);
        }}
      />
      <Typography variant="h5" gutterBottom>
        Add files
      </Typography>
      <SearchField>
        <TextField
          variant="outlined"
          color="secondary"
          fullWidth
          margin="dense"
          value={search_str}
          onChange={onSearchInput}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
        />
        <div className="search-btn">
          {search_str.length > 0 ? (
            <ClearIcon className="clear-btn" onMouseDown={onClearSearch} />
          ) : (
            <SearchIcon />
          )}
        </div>
      </SearchField>
      {search_list.length > 0 && search_focus && (
        <SearchResults theme={theme}>
          <List dense disablePadding>
            {search_list.map((search_item) => (
              <ListItem
                button
                key={search_item.id}
                onMouseDown={onSearchSelect(search_item)}
              >
                <ListItemText primary={search_item.title} />
              </ListItem>
            ))}
          </List>
        </SearchResults>
      )}
      {selected_files && selected_files.length > 0 && (
        <SelectedFilesContainer theme={theme}>
          {selected_files.map((item, index) => {
            return (
              <li
                key={index}
                draggable={true}
                onDragEnter={onDragEnter(index)}
                onDragStart={onDragStart(index)}
                onDragEnd={onDragEnd(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
              >
                <Chip
                  label={item.title}
                  icon={<DragIndicatorIcon />}
                  onDelete={onFileDelete(item)}
                />
              </li>
            );
          })}
        </SelectedFilesContainer>
      )}
      <hr />
      <Button variant="contained" color="secondary" onMouseDown={onAddFiles}>
        Save changes
      </Button>
    </MainContainer>
  );
};

Settings.propTypes = {
  onContentUpdate: PropTypes.func.isRequired,
};

export default withPageBlockEditorkUtils()(Settings);
