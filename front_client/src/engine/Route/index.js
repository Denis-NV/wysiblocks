import React from "react";
import PropTypes from "prop-types";

// Redux
import { useDispatch } from "react-redux";
import { SET_CURRENT_PATH } from "../../redux/Types";

// Utils
import { Helmet } from "react-helmet";

// Components
import Content from "../Content";

const Route = (props) => {
  const { path, page_data, className } = props;

  // Hooks
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch({ type: SET_CURRENT_PATH, payload: path });
  }, [path, dispatch]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{page_data.title}</title>
      </Helmet>
      <Content page_data={page_data} className={className} />
    </>
  );
};

Route.propTypes = {
  path: PropTypes.string.isRequired,
  page_data: PropTypes.object.isRequired,
};

export default Route;
