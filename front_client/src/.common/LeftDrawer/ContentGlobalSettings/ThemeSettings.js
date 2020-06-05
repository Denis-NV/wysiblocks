import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// Apollo GraphQl
import { useMutation, useApolloClient } from "@apollo/client";

import { UPDATE_THEME, SITE_DATA } from "../../../queries";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

// Utils
import lodash from "lodash";
import { SwatchesPicker } from "react-color";
import { fonts_options } from "../../../const";

// Components

const ThemeSettings = ({ setSave }) => {
  // Hooks
  const client = useApolloClient();
  const theme_edited = useRef(false);
  const updates_commited = useRef(false);
  const [data, setData] = useState(null);
  const theme = useTheme();
  const [updateTheme] = useMutation(UPDATE_THEME);

  useEffect(() => {
    if (!data || updates_commited.current) {
      updates_commited.current = false;

      const editable_settings = {
        primary_color: theme.palette.primary.main,
        secondary_color: theme.palette.secondary.main,
        main_font: theme.typography.fontFamily.split(",")[0],
      };

      setData({ ...editable_settings });
    }
  }, [data, setData, theme]);

  // Handlers
  setSave(() => {
    if (theme_edited.current) {
      theme_edited.current = false;
      updates_commited.current = true;

      const { sites } = client.readQuery({
        query: SITE_DATA,
        variables: {
          role: window._env_.REACT_APP_SITE_ROLE,
          live: false,
          draft: true,
        },
      });

      const old_theme = { ...sites[0].draft.theme };
      const new_theme = {
        palette: {
          primary: { main: data.primary_color },
          secondary: { main: data.secondary_color },
        },
        typography: { fontFamily: data.main_font },
      };

      lodash.merge(new_theme, old_theme);

      updateTheme({
        variables: {
          id: sites[0].id,
          title: sites[0].draft.title,
          theme: new_theme,
        },
      });
    }
  });

  const onSettingsChange = (field) => (event) => {
    theme_edited.current = true;

    setData({ ...data, [field]: event.target.value });
  };

  const onColorPicker = (field) => (color) => {
    theme_edited.current = true;

    setData({ ...data, [field]: color.hex });
  };

  const onFileUploaded = (new_url) => {
    theme_edited.current = true;

    setData({ ...data, header_logo: new_url });
  };

  // Render
  return (
    <Container>
      {data && (
        <>
          <Row theme={theme}>
            <Typography variant="caption" style={{ width: "100%" }}>
              Font Family:
            </Typography>
            <Input
              theme={theme}
              fullWidth
              margin="dense"
              size="small"
              select
              SelectProps={{
                native: true,
              }}
              value={data.main_font}
              onChange={onSettingsChange("main_font")}
            >
              {fonts_options.map((font, index) => (
                <option key={index} value={font}>
                  {font}
                </option>
              ))}
            </Input>
          </Row>
          <Row theme={theme}>
            <Typography variant="caption" style={{ width: "100%" }}>
              Primary color:
            </Typography>
            <Input
              theme={theme}
              fullWidth
              margin="dense"
              size="small"
              value={data.primary_color}
              onChange={onSettingsChange("primary_color")}
            />
          </Row>
          <Row theme={theme}>
            <SwatchesPicker
              color={data.primary_color}
              onChangeComplete={onColorPicker("primary_color")}
              width="auto"
            />
          </Row>
          <Row theme={theme}>
            <Typography variant="caption" style={{ width: "100%" }}>
              Secondary color:
            </Typography>
            <Input
              theme={theme}
              fullWidth
              margin="dense"
              size="small"
              value={data.secondary_color}
              onChange={onSettingsChange("secondary_color")}
            />
          </Row>
          <Row theme={theme}>
            <SwatchesPicker
              color={data.secondary_color}
              onChangeComplete={onColorPicker("secondary_color")}
              width="auto"
            />
          </Row>
        </>
      )}
    </Container>
  );
};

ThemeSettings.propTypes = {
  setSave: PropTypes.func.isRequired,
};

export default ThemeSettings;

// #######################################
// CSS
// #######################################

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(p) => p.theme.spacing(2)}px;
`;

const Input = styled(TextField)`
  /* margin-right: ${(p) => p.theme.spacing(3)}px; */
`;
