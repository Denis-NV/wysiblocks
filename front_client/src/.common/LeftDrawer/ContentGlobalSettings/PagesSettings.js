import React from "react";
import PropTypes from "prop-types";

// Apollo GraphQl
import { useApolloClient, useQuery, useMutation } from "@apollo/client";

import { SITE_DATA, NAV_ITEMS, UPDATE_PAGE } from "../../../queries";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";

// Utils
import { sortNav, getNavSiblings } from "../../DataUtils";
import { route_id_var } from "../../../const";

const PagesSettings = () => {
  // Hooks
  const client = useApolloClient();
  const theme = useTheme();
  const [updatePage] = useMutation(UPDATE_PAGE);

  const { sites } = client.readQuery({
    query: SITE_DATA,
    variables: {
      role: window._env_.REACT_APP_SITE_ROLE,
      live: false,
      draft: true,
    },
  });

  const site = sites[0] || {};

  // Handlers
  const onDeletePage = (id) => (event) => {
    // let new_pages = {};
    // for (const key in pages) {
    //   if (key !== id) new_pages[key] = pages[key];
    // }
    // const new_nav = nav.filter((item) => item.to !== pages[id].uri);
    // pages_edited.current = true;
    // nav_edited.current = true;
    // setPages(new_pages);
    // setNav(new_nav);
  };

  const onPageChange = (id, key) => (event) => {
    // const { draft } = client.readFragment({
    //   id: `Page:${id}`,
    //   fragment: gql`
    //     fragment PageFragment on Page {
    //       draft
    //     }
    //   `,
    // });
    // const new_draft = { ...draft, [key]: event.target.value };
    // client.writeFragment({
    //   id: `Page:${id}`,
    //   fragment: gql`
    //     fragment PageFragment on Page {
    //       draft
    //     }
    //   `,
    //   data: {
    //     draft: new_draft,
    //   },
    // });
    // pages_edited.current = true;
    // setPages({ ...pages, [id]: { ...pages[id], [key]: event.target.value } });
  };

  const onAddPage = (event) => {
    // pages_edited.current = true;
    // setPages({
    //   ...pages,
    //   [`TEMP_${Date.now()}`]: { uri: "", title: "" },
    // });
  };

  const onDeleteNavItem = (id) => (event) => {
    const new_nav = nav.filter((item) => item.id !== id);

    nav_edited.current = true;

    setNav(new_nav);
  };

  const onOrderNav = (id, up) => (event) => {
    const move_item = { ...nav.find((item) => item.id === id) };
    const siblings = getNavSiblings(nav, move_item);
    const move_index = siblings.findIndex((item) => item.id === id);

    if ((up && move_index > 0) || (!up && move_index < siblings.length - 1)) {
      const swap_item = up
        ? { ...siblings[move_index - 1] }
        : { ...siblings[move_index + 1] };

      [move_item.lft, swap_item.lft] = [swap_item.lft, move_item.lft];
      [move_item.rgt, swap_item.rgt] = [swap_item.rgt, move_item.rgt];

      const new_nav = sortNav(
        nav.map((item) => {
          switch (item.id) {
            case move_item.id:
              return move_item;
            case swap_item.id:
              return swap_item;
            default:
              return item;
          }
        })
      );

      nav_edited.current = true;

      setNav(new_nav);
    }
  };

  const onNavItemChange = (id, key) => (event) => {
    const item_index = nav.findIndex((item) => item.id === id);
    // console.log("onNavItemChange", id, key, event.target.value);
    const new_nav = [...nav];
    new_nav[item_index] = { ...nav[item_index], [key]: event.target.value };

    nav_edited.current = true;

    setNav(new_nav);
  };

  const onAddNavItem = (event) => {
    const last_item = nav[nav.length - 1];
    const last_rgt = last_item ? last_item.rgt : 0;

    const new_item = {
      id: `TEMP_${Date.now()}`,
      to: "",
      name: "",
      lft: last_rgt + 1,
      rgt: last_rgt + 2,
    };

    const new_nav = [...nav];

    new_nav.push(new_item);

    nav_edited.current = true;

    setNav(new_nav);
  };

  // Render
  const PagesUI = () => {
    const PageRow = ({ page }) => {
      const [page_state, setPageSate] = React.useState({
        title: page.draft.title,
        uri: page.uri,
      });

      const onInput = (key) => (e) => {
        setPageSate({ ...page_state, [key]: e.target.value });
      };

      const onBlur = (e) => {
        updatePage({
          variables: {
            id: page.id,
            uri: page_state.uri,
            title: page_state.title,
            header_hidden: page.draft.header_hidden,
            footer_hidden: page.draft.footer_hidden,
          },
        });
      };

      return (
        <Row>
          <Input
            theme={theme}
            style={{ flex: 50 }}
            fullWidth
            margin="dense"
            size="small"
            color="secondary"
            value={page_state.title}
            onChange={onInput("title")}
            onBlur={onBlur}
          />
          <Input
            theme={theme}
            style={{ flex: 50 }}
            fullWidth
            margin="dense"
            size="small"
            color="secondary"
            value={page_state.uri}
            onChange={onInput("uri")}
            onBlur={onBlur}
          />
          <Btns>
            <CancelIcon
              color="action"
              onClick={onDeletePage(page.id)}
              style={{ cursor: "pointer" }}
            />
          </Btns>
        </Row>
      );
    };

    const pages = site.pages || [];

    if (pages) {
      return (
        <>
          <Row>
            <Typography variant="caption" style={{ flex: 50 }}>
              Title
            </Typography>
            <Typography variant="caption" style={{ flex: 50 }}>
              Path
            </Typography>
            <Btns style={{ visibility: "hidden" }}>
              <CancelIcon />
            </Btns>
          </Row>
          {pages.map((page, index) => (
            <PageRow key={index} page={page} />
          ))}
          <Row>
            <Fab
              style={{ margin: "16px 0" }}
              color="secondary"
              aria-label="add"
              size="small"
              onClick={onAddPage}
            >
              <AddIcon />
            </Fab>
          </Row>
        </>
      );
    } else return null;
  };

  const NavUI = (props) => {
    const { data } = useQuery(NAV_ITEMS, {
      variables: {
        live: true,
        draft: false,
      },
    });

    if (data) {
      const nav = data.navItems || [];

      return (
        <>
          <Row>
            <Typography variant="caption" style={{ flex: 47 }}>
              Menu Name
            </Typography>
            <Typography variant="caption" style={{ flex: 53 }}>
              Link
            </Typography>
            <Btns style={{ visibility: "hidden" }}>
              <Order>
                <ExpandLessIcon fontSize="small" />
                <ExpandMoreIcon fontSize="small" />
              </Order>
              <CancelIcon style={{ cursor: "pointer" }} />
            </Btns>
          </Row>
          {nav.map((data) => {
            let link_opts = [{ id: Date.now(), title: "NOT SET", uri: "" }];

            Object.entries(pages).forEach(([id, data]) => {
              if (!data.uri.includes(`/:${route_id_var}`))
                link_opts.push({ ...data, id: id });
            });

            return (
              <Row key={data.id}>
                <Input
                  style={{ flex: 47 }}
                  theme={theme}
                  fullWidth
                  margin="dense"
                  size="small"
                  color="secondary"
                  value={data.name}
                  onChange={onNavItemChange(data.id, "name")}
                />
                <Input
                  style={{ flex: 53 }}
                  theme={theme}
                  fullWidth
                  margin="dense"
                  size="small"
                  color="secondary"
                  select
                  SelectProps={{
                    native: true,
                  }}
                  value={data.to}
                  onChange={onNavItemChange(data.id, "to")}
                >
                  {link_opts.map((page) => (
                    <option defaultValue="" key={page.id} value={page.uri}>
                      {"to: " + page.uri}
                    </option>
                  ))}
                </Input>
                <Btns>
                  <Order>
                    <ExpandLessIcon
                      color="action"
                      onClick={onOrderNav(data.id, true)}
                      style={{ cursor: "pointer" }}
                      fontSize="small"
                    />
                    <ExpandMoreIcon
                      color="action"
                      onClick={onOrderNav(data.id, false)}
                      style={{ cursor: "pointer" }}
                      fontSize="small"
                    />
                  </Order>
                  <CancelIcon
                    color="action"
                    onClick={onDeleteNavItem(data.id)}
                    style={{ cursor: "pointer" }}
                  />
                </Btns>
              </Row>
            );
          })}
        </>
      );
    } else return null;
  };

  return (
    <Container theme={theme}>
      <SectionTitle
        display="block"
        variant="subtitle1"
        gutterBottom
        paragraph
        theme={theme}
      >
        Pages
      </SectionTitle>
      <PagesUI />
      <SectionTitle
        display="block"
        variant="subtitle1"
        gutterBottom
        paragraph
        theme={theme}
      >
        Navigation
      </SectionTitle>
      {/* <NavUI /> */}
      {/* {pages && Object.entries(pages).length > 0 && (
        <Row>
          <Fab
            style={{ marginTop: 16 }}
            color="secondary"
            aria-label="add"
            size="small"
            onClick={onAddNavItem}
          >
            <AddIcon />
          </Fab>
        </Row>
      )} */}
    </Container>
  );
};

PagesSettings.propTypes = {};

export default PagesSettings;

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
`;

const Input = styled(TextField)`
  margin-right: ${(p) => p.theme.spacing(3)}px;
`;

const SectionTitle = styled(Typography)`
  border-bottom: 1px solid ${(p) => p.theme.palette.grey[400]};
`;

const Btns = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Order = styled.div`
  display: flex;
  flex-direction: column;
`;
