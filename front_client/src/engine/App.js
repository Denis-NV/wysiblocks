import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

import Store from "../redux/Store";
import { setUser } from "../redux/actions/UserActions";

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
import { SITE_DATA } from "../queries";

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

// Utils
import WebFont from "webfontloader";

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

const App = (props) => {
  const { editor, setUser } = props;

  // Hooks
  const fonts = React.useRef("");
  const [initialized, setInitialized] = React.useState(false);
  const [fonts_loaded, setFontsLoaded] = React.useState(false);

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
    console.dir(keycloak);

    setInitialized(true);
  };

  const onKeycloakTokens = (tokens) => {
    console.log("onKeycloakTokens", tokens);

    setUser(tokens.token, tokens.idToken);
  };

  const loadFonts = (theme) => {
    // TODO: Include all the fonts from each style tag
    // TODO: Switch to proper Google Fonts API for font management
    const font_to_load = theme.typography.fontFamily
      .split(",")[0]
      .replace(/"/g, "")
      .trim();

    if (fonts.current !== font_to_load) {
      fonts.current = font_to_load;

      const fonts_config = {
        classes: false,
        timeout: 3000,
        loading: () => {
          console.log(`${font_to_load} font is loading ...`);
        },
        active: () => {
          console.log(`${font_to_load} font is loaded`);
          setFontsLoaded(true);
        },
        inactive: () => {
          console.log(`${font_to_load} Font is inactive`);
        },
        google: {
          families: [`${font_to_load}:300,400,500,700`],
        },
      };

      WebFont.load(fonts_config);
    }
  };

  // Render
  const SiteBlocks = (props) => {
    const { loading, error, data } = useQuery(SITE_DATA, {
      variables: {
        role: window._env_.REACT_APP_SITE_ROLE,
        live: !editor.is_edit_mode,
        draft: editor.is_edit_mode,
      },
    });

    if (loading) return <ProgressBar variant="query" />;
    if (error) return <p>Error :(</p>;
    if (!data) return <p>No Site data was returned by the query</p>;
    const site_data = data.sites[0];
    if (!site_data)
      return (
        <p>
          No sites data was found for the role:{" "}
          {window._env_.REACT_APP_SITE_ROLE}
        </p>
      );

    const theme_obj = site_data.settings[editor.cur_key].theme || {};
    const theme = createMuiTheme(theme_obj);

    loadFonts(theme);

    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        {fonts_loaded &&
          site_data.site_blocks.map(({ type, component }, index) => (
            <div key={index}>
              <p>
                {type}: {component}
              </p>
            </div>
          ))}
      </ThemeProvider>
    );
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
          {initialized ? <SiteBlocks /> : <ProgressBar variant="query" />}
        </StylesProvider>
      </ApolloProvider>
    </KeycloakProvider>
  );
};

App.propTypes = {
  editor: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
  };
};

export default connect(mapStateToProps, { setUser })(App);

// #######################################
// CSS
// #######################################

const ProgressBar = styled(LinearProgress)`
  background-color: #bdbdbd;

  .MuiLinearProgress-barColorPrimary {
    background-color: #757575;
  }
`;
