import React, { useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { getSiteBlockTypes } from "../../../redux/actions/RemoteActions";

// CSS and MUI
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const SiteBlockTypes = ({
  site,
  type,
  getSiteBlockTypes,
  closeCallback,
  actionCallback,
}) => {
  // Hooks
  useEffect(() => {
    if (!site.site_block_types_data[type]) getSiteBlockTypes(type);
  }, [type, site.site_block_types_data, getSiteBlockTypes]);

  // Rendering
  return (
    <div style={{ minWidth: 200 }}>
      {site.site_block_types_data[type] ? (
        <List>
          {site.site_block_types_data[type].map((item, index) => (
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
        <p>Loading site block types ...</p>
      )}
    </div>
  );
};

SiteBlockTypes.propTypes = {
  site: PropTypes.object.isRequired,
  getSiteBlockTypes: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  closeCallback: PropTypes.func.isRequired,
  actionCallback: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
  };
};

const mapActionsToProps = { getSiteBlockTypes };

export default connect(mapStateToProps, mapActionsToProps)(SiteBlockTypes);

// #######################################
// CSS
// #######################################
