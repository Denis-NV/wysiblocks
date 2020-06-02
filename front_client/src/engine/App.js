import React from "react";
import PropTypes from "prop-types";

// Redux
// import { setUser } from "./redux/actions/UserActions";
import { connect } from "react-redux";
import { setSiteData } from "../redux/actions/LocalActions";
import { loadGoogleFont } from "../redux/actions/RemoteActions";
import { setAdminMode } from "../redux/actions/UserActions";

// Apollo
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";

// GraphGL
import { ApolloProvider } from "react-apollo";
import { SITE_DATA } from "../queries";

// Keycloak
import Keycloak from "keycloak-js";
import { KeycloakProvider } from "@react-keycloak/web";

// CSS & MUI
import { StylesProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import GlobalStyles from "../styles";

import styled from "styled-components";

import { ThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import LinearProgress from "@material-ui/core/LinearProgress";

// Components
import Page from "./Page";
import Editor from "./Editor";

import GraphQLLazyQuery from "../.common/GraphQLLazyQuery";

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
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          // Authorization: store.getState().User.id_token
          //   ? `Bearer ${store.getState().User.id_token}`
          //   : "",
        },
      };
    }),
    new HttpLink({
      uri: window._env_.REACT_APP_GRAPHQL,
      credentials: "same-origin",
    }),
  ]),
});

/*
 *   ******************
 *   Root App Component
 *   ******************
 */

const App = ({
  site: { site_id, site_blocks, pages, font_is_ready },
  theme_reducer,
  setSiteData,
  setAdminMode,
  loadGoogleFont,
}) => {
  const theme = createMuiTheme(theme_reducer);

  let getSiteData = () => {};

  // Hooks
  const [initialized, setInitialized] = React.useState(false);
  const site_data_requested = React.useRef();

  // React.useLayoutEffect(() => {
  //   if (!site_blocks && initialized) {
  //     if (!site_data_requested.current) {
  //       //site_data_requested.current = true;
  //       //getSiteData();
  //     }
  //   }
  // }, [initialized, site_blocks]);

  // Handlers
  const onKeycloakEvent = (event, error) => {
    console.log("onKeycloakEvent", event, error || "No errors");
    console.log(keycloak);

    setInitialized(true);
  };

  const onKeycloakTokens = (tokens) => {
    console.log("onKeycloakTokens", tokens);

    //store.dispatch(setUser(tokens.token, tokens.idToken));
  };

  // Render
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
              <GraphQLLazyQuery
                setQueryTrigger={(trigger) => (getSiteData = trigger)}
                QUERY={SITE_DATA}
                variables={{ id: site_id }}
                completeCb={(data) => {
                  setSiteData(data);
                  setAdminMode(data.siteItem.isAdmin);
                  loadGoogleFont(theme);

                  site_data_requested.current = false;
                }}
                LoadingComp={<ProgressBar variant="query" color="primary" />}
                ErrorComp={null}
              >
                {font_is_ready && site_blocks && (
                  <>
                    <Page
                      site_blocks_data={site_blocks}
                      content_pages_data={pages}
                    />
                    <Editor />
                  </>
                )}
              </GraphQLLazyQuery>
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
  setSiteData: PropTypes.func.isRequired,
  setAdminMode: PropTypes.func.isRequired,
  loadGoogleFont: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
    theme_reducer: state.Theme,
  };
};

const mapActionsToProps = {
  setSiteData,
  setAdminMode,
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
