import React from "react";
import PropTypes from "prop-types";

// CSS & MUI
import Drawer from "@material-ui/core/Drawer";

// MAIN
const LeftDrawer = ({ children, is_open, closeCallback }) => {
  // Handlers
  const onDrawerCloseRequest = (e) => {
    e.stopPropagation();

    closeCallback();
  };

  return (
    <Drawer open={is_open} onClose={onDrawerCloseRequest}>
      {children}
    </Drawer>
  );
};

LeftDrawer.propTypes = {
  is_open: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func.isRequired,
};

export default LeftDrawer;

// #######################################
// CSS
// #######################################
