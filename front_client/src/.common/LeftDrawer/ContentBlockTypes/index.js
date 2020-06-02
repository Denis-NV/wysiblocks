import React, { useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { getContentBlockTypes } from "../../../redux/actions/RemoteActions";

// CSS and MUI
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const ContentBlockTypes = ({
  site,
  getContentBlockTypes,
  closeCallback,
  actionCallback,
}) => {
  // Hooks
  useEffect(() => {
    if (!site.content_block_types_data) getContentBlockTypes();
  }, [site.content_block_types_data, getContentBlockTypes]);

  // Rendering
  return (
    <div style={{ minWidth: 200 }}>
      {site.content_block_types_data ? (
        <List>
          {site.content_block_types_data.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={(e) => {
                actionCallback(item);
                closeCallback();
              }}
            >
              <ListItemText primary={item.menu.title} />
            </ListItem>
          ))}
        </List>
      ) : (
        <p>Loading block types ...</p>
      )}
    </div>
  );
};

ContentBlockTypes.propTypes = {
  site: PropTypes.object.isRequired,
  getContentBlockTypes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
  };
};

const mapActionsToProps = { getContentBlockTypes };

export default connect(mapStateToProps, mapActionsToProps)(ContentBlockTypes);

// #######################################
// CSS
// #######################################
