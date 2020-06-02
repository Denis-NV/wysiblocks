import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

// Icons
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

// Utils
import { DETAILS_STEP } from "../const";

// Components
import BasketBtn from "../.common/BasketBtn";

// Default
const ItemSearchStep = (props) => {
  const {
    cur_data,
    search_data,
    stepRequestCb,
    itemViewCb,
    onSearchCb,
  } = props;
  const search_page_limit = 5;
  const feed = search_data.reagentFeed || {};
  const ui_state = cur_data.ui_state || {};
  const is_loading = ui_state.search || false;

  // Hooks
  const theme = useTheme();
  const items_requested = React.useRef();
  const search_timeout = React.useRef();
  const items = React.useRef([]);
  const [search_str, setSearchStr] = React.useState("");

  React.useLayoutEffect(() => {
    if (!items_requested.current) {
      items_requested.current = true;

      onSearchCb(search_str, search_page_limit, 0);
    }
  }, [search_str, onSearchCb]);

  // Handlers
  const onSearchInput = (e) => {
    if (search_str !== e.target.value) {
      const new_str = e.target.value;

      setSearchStr(new_str);

      const search_req_str = new_str.length > 0 ? `%%${new_str}%` : "";

      if (search_timeout.current) clearTimeout(search_timeout.current);

      search_timeout.current = setTimeout(() => {
        items.current = [];

        onSearchCb(search_req_str, search_page_limit, 0);
      }, 500);
    }
  };

  const onClearSearch = (e) => {
    items.current = [];

    setSearchStr("");
    onSearchCb("", search_page_limit, 0);
  };

  // Render
  const loaded_items = feed.nodes || [];

  loaded_items.forEach((loaded_item) => {
    if (
      items.current.find((new_item) => new_item.id === loaded_item.id) ===
      undefined
    ) {
      items.current.push({ ...loaded_item });
    }
  });

  return (
    <MainContainer theme={theme}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={8}>
          <Typography variant="h1" paragraph className="step-title">
            Find reagents
          </Typography>
          <Typography variant="body1" paragraph>
            The UK COVID-19 Protein Portal aims to provide reagents free of
            charge to scientists working in UK universities and research
            institutes. In order to maximise the best use of resources you will
            be asked to provide a scientific case for your reagent selection, to
            enable peer review and resource allocation. For any questions about
            eligibility please refer to our{" "}
            <Link
              target="_blank"
              href="https://covid19proteinportal.org/faq.html"
            >
              FAQs.
            </Link>
            <br />
            <br />
            If you have any questions or need a protein that is not yet listed,
            please{" "}
            <Link
              target="_blank"
              href="mailto:contact@covid19proteinportal.org"
            >
              contact us
            </Link>
            .
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <BasketBtn
            className="paragraph"
            stepRequestCb={stepRequestCb}
            basket={cur_data.basket}
          />
          <InstructionsContainer theme={theme}>
            <Typography
              variant="body1"
              className="side-notes-header"
              color="primary"
            >
              How it works
            </Typography>
            <ol>
              <li>
                <Typography variant="body1">
                  Find the protein(s) you need
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Add them to your selection
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Supply scientific details
                </Typography>
              </li>
            </ol>
          </InstructionsContainer>
        </Grid>
      </Grid>
      <SearchField theme={theme}>
        <TextField
          variant="outlined"
          color="secondary"
          placeholder="Search for reagent"
          fullWidth
          margin="dense"
          value={search_str}
          onChange={onSearchInput}
        />
        <div className="search-btn">
          {search_str.length > 0 ? (
            <ClearIcon className="clear-btn" onMouseDown={onClearSearch} />
          ) : (
            <SearchIcon />
          )}
        </div>
      </SearchField>
      <ItemContainer theme={theme}>
        {items.current.map((item, index) => {
          const fields = item.reagent_field_dataList;

          const uniid_ind = fields.findIndex(
            (item) => item.reagent_fieldList[0].ref === "uniprotid"
          );

          return (
            <Paper key={index} elevation={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" className="shopping-item-title">
                    {item.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} md={10}>
                  <Grid container spacing={1}>
                    <Grid item xs={4} md={2}>
                      {uniid_ind > -1 && (
                        <>
                          <strong>{`Uniprot ID: `}</strong>
                          <br />
                          <Link
                            href={`https://www.uniprot.org/uniprot/${fields[uniid_ind].data}`}
                            target="_blank"
                          >{`${fields[uniid_ind].data || ""}`}</Link>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={8} md={10}>
                      <>
                        <strong>{`Construct ID: `}</strong>
                        <br />
                        {item.sku || ""}
                      </>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onMouseDown={() => {
                      itemViewCb(item.id);
                      stepRequestCb(DETAILS_STEP);
                    }}
                  >
                    View Details
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
        {is_loading && (
          <div className="progress-container">
            <CircularProgress />
          </div>
        )}
      </ItemContainer>
      {feed.pageInfo && feed.pageInfo.hasNextSlice && (
        <LoadMoreContainer theme={theme}>
          <Button
            variant="outlined"
            onMouseDown={(e) => {
              onSearchCb(
                search_str,
                search_page_limit,
                feed.pageInfo.nextIndex
              );
            }}
          >
            Load more
          </Button>
        </LoadMoreContainer>
      )}
    </MainContainer>
  );
};

ItemSearchStep.propTypes = {
  cur_data: PropTypes.object.isRequired,
  stepRequestCb: PropTypes.func.isRequired,
  itemViewCb: PropTypes.func.isRequired,
  search_data: PropTypes.object.isRequired,
};

export default ItemSearchStep;

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .step-title {
    margin-top: 14px;
  }
`;

const InstructionsContainer = styled.div`
  margin-bottom: ${(p) => p.theme.spacing(2)}px;

  ol {
    padding-left: 20px;
    margin: 0;
  }

  .MuiTypography-h6 {
    font-size: 1.5rem;
  }
`;

const SearchField = styled.div`
  position: relative;
  margin-bottom: ${(p) => p.theme.spacing(3)}px;

  .search-btn {
    position: absolute;
    top: 16px;
    right: 6px;
    opacity: 0.5;
  }

  .clear-btn {
    cursor: pointer;
  }
`;

const ItemContainer = styled.div`
  font-size: 16px;

  strong {
    display: inline-block;
    margin-bottom: 6px;
  }

  .MuiPaper-root {
    padding: ${(p) => p.theme.spacing(2)}px;
    margin-bottom: ${(p) => p.theme.spacing(1)}px;

    h6 {
      text-transform: uppercase;
      font-weight: 600;
    }
  }
`;

const LoadMoreContainer = styled.div`
  margin-top: ${(p) => p.theme.spacing(4)}px;
  margin-bottom: ${(p) => p.theme.spacing(2)}px;

  display: flex;
  justify-content: center;
`;
