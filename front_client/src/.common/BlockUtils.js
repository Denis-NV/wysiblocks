import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect, useDispatch, useStore } from "react-redux";
import { updateBlock } from "../redux/actions/LocalActions";
import { updateSiteBlock } from "../redux/actions/LocalActions";
import { SET_HEADER_HEIGHT } from "../redux/Types";

// Theme
import { withTheme } from "@material-ui/core/styles";

//
export const withPageBlockUtils = (mapStateToProps, mapActionsToProps) => (
  WrappedComponent
) => {
  const hocComponent = ({ ...props }) => {
    const { page_id, block_data_set, updateBlock } = props;

    const options = block_data_set.options_data;
    const block_id = block_data_set.id.toString();

    // Handlers
    const onContentUpdate = (field, value) => {
      const data = { [field]: value };

      updateBlock(page_id, block_id, data);
    };

    return (
      <WrappedComponent
        {...props}
        options={options}
        block_id={block_id}
        onContentUpdate={onContentUpdate}
      />
    );
  };

  hocComponent.propTypes = {
    theme: PropTypes.object.isRequired,
    updateBlock: PropTypes.func.isRequired,
    block_data_set: PropTypes.object.isRequired,
    page_id: PropTypes.string.isRequired,
    setEditorContent: PropTypes.func.isRequired,
    showEditorDraw: PropTypes.func.isRequired,
    hideEditorDraw: PropTypes.func.isRequired,
  };

  return connect(mapStateToProps, { ...mapActionsToProps, updateBlock })(
    withTheme(hocComponent)
  );
};

//
export const withPageBlockEditorkUtils = () => (WrappedComponent) => {
  const hocComponent = ({ ...props }) => {
    const { page_id, block_data_set, updateBlock } = props;

    const options = block_data_set.options_data;
    const block_id = block_data_set.id.toString();

    // Handlers
    const onContentUpdate = (field, value) => {
      const data = { [field]: value };

      updateBlock(page_id, block_id, data);
    };

    return (
      <WrappedComponent
        {...props}
        options={options}
        block_id={block_id}
        onContentUpdate={onContentUpdate}
      />
    );
  };

  hocComponent.propTypes = {
    theme: PropTypes.object.isRequired,
    updateBlock: PropTypes.func.isRequired,
    block_data_set: PropTypes.object.isRequired,
    page_id: PropTypes.string.isRequired,
    hideEditorDraw: PropTypes.func.isRequired,
  };

  return connect(null, { updateBlock })(withTheme(hocComponent));
};

//
export const withHeaderBlockUtils = (mapStateToProps, mapActionsToProps) => (
  WrappedComponent
) => {
  const hocComponent = ({ ...props }) => {
    const { site_block, cur_data_key } = props;

    const options = site_block.settings[cur_data_key].custom_map;
    // console.log("header settings:", options);

    // TODO: not sure if block_is is required by the block
    const block_id = site_block.id;

    // Handlers
    // TODO: get rid of this later
    const onContentUpdate = (field, value) => {
      // const data = { [field]: value };
      // updateSiteBlock(block_id, data);
    };

    const HeightMeasuredWrappedComponent = (props) => {
      const container_ref = React.useRef();
      const dispatch = useDispatch();
      const store = useStore();

      React.useLayoutEffect(() => {
        if (container_ref.current) {
          const cur_height = store.getState().Layout.header_height;
          const new_height = container_ref.current.clientHeight;

          if (cur_height !== new_height) {
            dispatch({
              type: SET_HEADER_HEIGHT,
              payload: new_height,
            });
          }
        }
      }, []);
      // TODO: change "options" to "settings"
      return (
        <div ref={container_ref}>
          <WrappedComponent
            {...props}
            options={options}
            block_id={block_id}
            onContentUpdate={onContentUpdate}
          />
        </div>
      );
    };

    return <HeightMeasuredWrappedComponent {...props} />;
  };

  hocComponent.propTypes = {
    theme: PropTypes.object.isRequired,
    site_block: PropTypes.object.isRequired,
    cur_data_key: PropTypes.string.isRequired,
    setEditorContent: PropTypes.func.isRequired,
    showEditorCb: PropTypes.func.isRequired,
    hideEditorCb: PropTypes.func.isRequired,
  };

  return connect(mapStateToProps, { ...mapActionsToProps })(
    withTheme(hocComponent)
  );
};

//
export const withFooterBlockUtils = (mapStateToProps, mapActionsToProps) => (
  WrappedComponent
) => {
  const hocComponent = ({ ...props }) => {
    const { site_block, cur_data_key } = props;

    const options = site_block.settings[cur_data_key].custom_map;
    const block_id = site_block.id;

    // Handlers
    const onContentUpdate = (field, value) => {
      // const data = { [field]: value };
      // updateSiteBlock(block_id, data);
    };

    return (
      <WrappedComponent
        {...props}
        options={options}
        block_id={block_id}
        onContentUpdate={onContentUpdate}
      />
    );
  };

  hocComponent.propTypes = {
    theme: PropTypes.object.isRequired,
    site_block: PropTypes.object.isRequired,
    cur_data_key: PropTypes.string.isRequired,
    setEditorContent: PropTypes.func.isRequired,
    showEditorCb: PropTypes.func.isRequired,
    hideEditorCb: PropTypes.func.isRequired,
  };

  return connect(mapStateToProps, { ...mapActionsToProps, updateSiteBlock })(
    withTheme(hocComponent)
  );
};
