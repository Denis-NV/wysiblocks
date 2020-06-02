import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect, useDispatch } from "react-redux";
import { SET_NAV_WARNING } from "../../redux/Types";
import { navigateTo, setEditMode } from "../../redux/actions/LocalActions";
import { commitPageEdits } from "../../redux/actions/RemoteActions";

// Components
import EditingUI from "./EditingUI";
import ContentWarning from "../../.common/GlobalModal/ContentWarning";
import GlobalModal from "../../.common/GlobalModal";

const Editor = (props) => {
  const { editor, ui } = props;

  // Hooks
  const dispatch = useDispatch();

  // Handlers
  const onWaringCallback = (positive) => {
    if (positive) commitPageEdits();

    setEditMode(false, true);
    navigateTo(ui.navigation_warning.path);
  };

  const onModalClose = () => {
    dispatch({
      type: SET_NAV_WARNING,
      payload: { show: false, path: "" },
    });
  };

  return (
    <>
      {editor.is_edit_mode && (
        <GlobalModal
          is_open={ui.navigation_warning.show}
          closeCallback={onModalClose}
        >
          <ContentWarning
            warning_data={{
              title: "Leave without saving?",
              paragraphs: [
                "Please save the changes before navigating away from the current page",
                "If you press DISCARD, your edits will be lost next time you refresh the page.",
              ],
            }}
            actionCallback={onWaringCallback}
            closeCallback={onModalClose}
          />
        </GlobalModal>
      )}
      <EditingUI />
    </>
  );
};

Editor.propTypes = {
  editor: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
    ui: state.UI,
  };
};

const mapActionsToProps = {
  navigateTo,
  setEditMode,
  commitPageEdits,
};

export default connect(mapStateToProps, mapActionsToProps)(Editor);
