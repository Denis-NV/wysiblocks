import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";

// Utils
import CustomFieldHOC from "../CustomFieldHOC";

const SelectOther = (props) => {
  const { required, type, value_data, options, onValueChangeCb } = props;
  const value = value_data.val || {};
  const value_selection = value.selection || [];
  const value_other = value.other || "";
  const opts = options.opts ? options.opts.split("; ").concat("Other") : [];

  value.type = type;

  // Hooks
  const select_ref = React.useRef();

  React.useLayoutEffect(() => {
    if (select_ref.current) {
      const input_ref = select_ref.current.querySelector("input");

      input_ref.removeAttribute("type");
      input_ref.setAttribute("required", required ? "true" : "false");
      input_ref.style.width = "1px";
      input_ref.style.height = "1px";
      input_ref.style.opacity = "0";
    }
  }, []);

  // Handlers
  const onSelect = (e) => {
    const other_str = e.target.value.includes("Other")
      ? value_other
      : undefined;

    onValueChangeCb({ ...value, selection: e.target.value, other: other_str });
  };

  const onOtherInput = (e) => {
    let new_str = e.target.value;

    if (options.max) new_str = new_str.slice(0, options.max);

    onValueChangeCb({ ...value, other: new_str });
  };

  return (
    <MainContainer>
      <FormControl variant="outlined">
        <Select
          className="MuiFormControl-marginDense"
          multiple
          margin="dense"
          value={value_selection}
          renderValue={(selected) => selected.join(", ")}
          onChange={onSelect}
          ref={select_ref}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
        >
          {opts.map((opt, index) => (
            <MenuItem key={index} value={opt}>
              <Checkbox checked={value_selection.indexOf(opt) > -1} />
              <ListItemText primary={opt} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {value_selection.indexOf(opts[opts.length - 1]) > -1 && (
        <TextField
          className="select-fields"
          variant="outlined"
          color="secondary"
          required
          fullWidth
          multiline
          margin="dense"
          placeholder="Other:"
          value={value_other}
          onChange={onOtherInput}
        />
      )}
    </MainContainer>
  );
};

SelectOther.propTypes = {};

export default CustomFieldHOC(SelectOther);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .MuiFormControl-root {
    max-width: 100%;
  }

  .MuiInputBase-root {
    min-width: 235px;
  }
`;
