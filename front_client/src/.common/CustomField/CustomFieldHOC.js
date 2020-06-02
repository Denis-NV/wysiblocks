import React from "react";
import PropTypes from "prop-types";

export default (WrappedComponent) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    required: PropTypes.bool.isRequired,
    options: PropTypes.object.isRequired,
    value_data: PropTypes.object.isRequired,
    onValueChangeCb: PropTypes.func.isRequired,
  };

  return hocComponent;
};
