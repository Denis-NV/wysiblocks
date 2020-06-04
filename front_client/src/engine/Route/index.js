import React from "react";
import PropTypes from "prop-types";

// Redux
import { useDispatch } from "react-redux";
import { SET_CURRENT_ADDRESS } from "../../redux/Types";

// Utils
import { Helmet } from "react-helmet";

// Components
import Content from "../Content";

const Route = (props) => {
  const { path, cur_data_key, page_data, className } = props;
  const page_setting = page_data[cur_data_key];

  // Hooks
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch({ type: SET_CURRENT_ADDRESS, payload: path });
  }, [path, dispatch]);

  return React.useMemo(
    () => (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{page_setting.title}</title>
        </Helmet>
        <Content page_data={page_data} className={className} />
      </>
    ),
    [page_data, className, page_setting.title]
  );
};

Route.propTypes = {
  path: PropTypes.string.isRequired,
  cur_data_key: PropTypes.string.isRequired,
  page_data: PropTypes.object.isRequired,
};

export default Route;
