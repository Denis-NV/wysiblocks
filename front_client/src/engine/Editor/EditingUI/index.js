import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { setEditMode } from "../../../redux/actions/LocalActions";
import { commitPageEdits } from "../../../redux/actions/RemoteActions";

// Keycloak
import { useKeycloak } from "@react-keycloak/web";

// CSS & MUI
import styled from "styled-components";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Switch from "@material-ui/core/Switch";
import Fab from "@material-ui/core/Fab";
import KeyIcon from "@material-ui/icons/VpnKey";
import PublishIcon from "@material-ui/icons/Publish";
import SettingsIcon from "@material-ui/icons/Settings";

// Components
import ContentWarning from "../../../.common/GlobalModal/ContentWarning";
import GlobalModal from "../../../.common/GlobalModal";
import LeftDrawer from "../../../.common/LeftDrawer";
import ContentGlobalSettings from "../../../.common/LeftDrawer/ContentGlobalSettings";

// Auth UI
const AdminDrawerContent = (props) => {
  const { profile } = props;

  // Hooks
  const [keycloak] = useKeycloak();

  return (
    <AdminContainer>
      {keycloak.authenticated ? (
        <>
          <Typography
            variant="h6"
            paragraph
          >{`Hi ${profile.given_name}!`}</Typography>
          <Typography variant="body1" paragraph>
            You are currently logged in. Log out?
          </Typography>
          <Button
            color="secondary"
            fullWidth
            variant="contained"
            onClick={(e) => keycloak.logout()}
          >
            Log out
          </Button>
          <br />
          <br />
          <Link
            color="textPrimary"
            href={`${window._env_.REACT_APP_KEYCLOAK_BASE_URL}/auth/realms/aria/account/`}
            target="_blank"
          >
            Edit Profile
          </Link>
        </>
      ) : (
        <>
          <Typography variant="h6" paragraph>
            Please log in to edit the site.
          </Typography>
          <Button
            color="secondary"
            fullWidth
            variant="contained"
            onClick={(e) => keycloak.login()}
          >
            Log in
          </Button>
        </>
      )}
    </AdminContainer>
  );
};

// default
const EditingUI = ({
  commitPageEdits,
  setEditMode,
  editor: { is_edit_mode },
  nav: { locked_page_id },
  user: { profile, is_admin },
}) => {
  // Hooks
  const [state, setState] = useState({
    save_warning_open: false,
    admin_open: false,
    settings_open: false,
  });

  // Handlers
  const onAdminPressed = (e) => {
    setState({ ...state, admin_open: true });
  };

  const onEditModetoggle = (e) => {
    if (is_edit_mode && locked_page_id !== "") {
      setState({ ...state, save_warning_open: true });
    } else {
      setEditMode(!is_edit_mode);
    }
  };

  const onWaringCallback = (positive) => {
    if (positive) commitPageEdits();

    setEditMode(false, true);
  };

  const onModalClose = () => {
    setState({ ...state, save_warning_open: false });
  };

  const onSettingsClicked = (e) => {
    setState({ ...state, settings_open: true });
  };

  const onDrawerClose = (type) => {
    setState({ ...state, [type]: false });
  };

  // Render
  return (
    <MainContainer>
      <GlobalModal
        is_open={state.save_warning_open}
        closeCallback={onModalClose}
      >
        <ContentWarning
          warning_data={{
            title: "Leave without saving?",
            paragraphs: [
              "Please save the changes before switching Editing mode off",
              "If you press DISCARD, your edits will be lost next time you refresh the page.",
            ],
          }}
          actionCallback={onWaringCallback}
          closeCallback={onModalClose}
        />
      </GlobalModal>
      <LeftDrawer
        is_open={state.admin_open}
        closeCallback={() => onDrawerClose("admin_open")}
      >
        <AdminDrawerContent
          profile={profile}
          closeCallback={() => onDrawerClose("admin_open")}
        />
      </LeftDrawer>
      <LeftDrawer
        is_open={state.settings_open}
        closeCallback={() => onDrawerClose("settings_open")}
      >
        <ContentGlobalSettings
          closeCallback={() => onDrawerClose("settings_open")}
        />
      </LeftDrawer>
      <div>
        <AdminBtn
          color="secondary"
          aria-label="admin"
          size="medium"
          onClick={onAdminPressed}
        >
          <KeyIcon />
        </AdminBtn>
        {profile.preferred_username && is_admin && (
          <EditToggle
            color="default"
            aria-label="edit"
            size="medium"
            onClick={onEditModetoggle}
          >
            <Switch
              checked={is_edit_mode}
              color="secondary"
              value="Edit"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          </EditToggle>
        )}
        {is_edit_mode && (
          <>
            <SettingsBtn
              color="secondary"
              aria-label="settings"
              size="medium"
              onClick={onSettingsClicked}
            >
              <SettingsIcon />
            </SettingsBtn>
          </>
        )}
        {locked_page_id !== "" && (
          <SaveBtn
            color="secondary"
            aria-label="save"
            size="medium"
            onClick={(e) => {
              commitPageEdits();
            }}
          >
            <PublishIcon />
          </SaveBtn>
        )}
      </div>
    </MainContainer>
  );
};

EditingUI.propTypes = {
  editor: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  commitPageEdits: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
    nav: state.Nav,
    user: state.User,
  };
};

const mapActionsToProps = { commitPageEdits, setEditMode };

export default connect(mapStateToProps, mapActionsToProps)(EditingUI);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;

  z-index: 1000;
`;

const AdminBtn = styled(Fab)`
  /* position: fixed; */
  bottom: 20px;
  left: 20px;
`;

const EditToggle = styled(Fab)`
  /* position: fixed; */
  bottom: 20px;
  left: 40px;
`;

const SettingsBtn = styled(Fab)`
  /* position: fixed; */
  bottom: 20px;
  left: 60px;
`;

const SaveBtn = styled(Fab)`
  /* position: fixed; */
  bottom: 20px;
  left: 80px;
`;

const AdminContainer = styled.div`
  min-width: 200px;
  max-width: 250px;

  padding: 1rem;

  text-align: center;
`;
