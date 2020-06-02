import React from "react";
import PropTypes from "prop-types";

// Redux
// import { setUser } from "./redux/actions/UserActions";
import Store from "../redux/Store";
import { connect } from "react-redux";
import { loadGoogleFont } from "../redux/actions/RemoteActions";

// Apollo
import {
  from,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  useQuery,
} from "@apollo/client";

// GraphGL
import { LIVE_SITE_DATA } from "../queries";

// Keycloak
import Keycloak from "keycloak-js";
import { KeycloakProvider } from "@react-keycloak/web";

// CSS & MUI
import styled from "styled-components";
import GlobalStyles from "../styles";

import { StylesProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import LinearProgress from "@material-ui/core/LinearProgress";

// Components
import Page from "./Page";
import Editor from "./Editor";

/*
 *   ******************
 *   App Initialization
 *   ******************
 */

// Keycloak Setup
const keycloak = new Keycloak({
  realm: window._env_.REACT_APP_KEYCLOAK_REALM,
  clientId: window._env_.REACT_APP_KEYCLOAK_CLIENT_ID,
  url: `${window._env_.REACT_APP_KEYCLOAK_BASE_URL}/auth/`,
});

// Apollo Setup
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }) => ({
    headers: {
      ...headers,
      Authorization: Store.getState().User.id_token
        ? `Bearer ${Store.getState().User.id_token}`
        : "",
    },
  }));
  return forward(operation);
});

const link = from([
  authLink,
  new HttpLink({
    uri: window._env_.REACT_APP_GRAPHQL,
    credentials: "same-origin",
  }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

/*
 *   ******************
 *   Root App Component
 *   ******************
 */

const App = ({ site: { font_is_ready }, theme_reducer, loadGoogleFont }) => {
  const theme = createMuiTheme(theme_reducer);

  // Hooks
  const [initialized, setInitialized] = React.useState(false);

  // {font_is_ready && (
  //   <>
  //     <Page
  //       site_blocks_data={site_blocks}
  //       content_pages_data={pages}
  //     />
  //     <Editor />
  //   </>
  // )}

  // Handlers
  const onKeycloakEvent = (event, error) => {
    console.log("onKeycloakEvent", event, error || "No errors");
    // console.log(keycloak);

    setInitialized(true);
  };

  const onKeycloakTokens = (tokens) => {
    console.log("onKeycloakTokens", tokens);

    //store.dispatch(setUser(tokens.token, tokens.idToken));
  };

  // Render
  const SiteBlocks = (props) => {
    const { loading, error, data } = useQuery(LIVE_SITE_DATA, {
      variables: { role: window._env_.REACT_APP_SITE_ROLE },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return data.sites[0].site_blocks.map(({ type, component }, index) => (
      <div key={index}>
        <p>
          {type}: {component}
        </p>
      </div>
    ));
  };

  return (
    <KeycloakProvider
      keycloak={keycloak}
      initConfig={{
        onLoad: "check-sso",
        checkLoginIframe: false,
      }}
      onEvent={onKeycloakEvent}
      onTokens={onKeycloakTokens}
    >
      <ApolloProvider client={client}>
        <StylesProvider injectFirst>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <GlobalStyles theme={theme} />
            {initialized ? (
              <SiteBlocks />
            ) : (
              <ProgressBar variant="query" color="primary" />
            )}
          </ThemeProvider>
        </StylesProvider>
      </ApolloProvider>
    </KeycloakProvider>
  );
};

App.propTypes = {
  site: PropTypes.object.isRequired,
  loadGoogleFont: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
    theme_reducer: state.Theme,
  };
};

const mapActionsToProps = {
  loadGoogleFont,
};

export default connect(mapStateToProps, mapActionsToProps)(App);

// #######################################
// CSS
// #######################################

const ProgressBar = styled(LinearProgress)`
  background-color: #bdbdbd;

  .MuiLinearProgress-barColorPrimary {
    background-color: #757575;
  }
`;
