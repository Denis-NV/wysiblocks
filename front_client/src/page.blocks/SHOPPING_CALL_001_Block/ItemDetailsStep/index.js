import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

// Utils
import { SEARCH_STEP, BASKET_STEP } from "../const";

// Components
import BasketBtn from "../.common/BasketBtn";

// Default
const ItemDetailsStep = (props) => {
  const {
    item_data,
    cur_data,
    stepRequestCb,
    getDetailsCb,
    editBasketCb,
  } = props;
  const reagent = item_data.reagentItem || {};
  const basket = cur_data.basket || [];
  const is_selected = basket.findIndex((item) => item.id === reagent.id) > -1;
  const ui_state = cur_data.ui_state || {};
  const is_loading = ui_state.details || false;

  // Hooks
  const theme = useTheme();
  const details_requested = React.useRef();

  React.useLayoutEffect(() => {
    if (!details_requested.current) {
      details_requested.current = true;

      if (cur_data.view_item_id) getDetailsCb(parseInt(cur_data.view_item_id));
    }
  }, [getDetailsCb, cur_data.view_item_id]);

  // Render
  const CustomFields = (props) => {
    const { fields } = props;

    const getFieldIndex = (ref) => {
      return fields.findIndex((item) => item.reagent_fieldList[0].ref === ref);
    };

    const SpecRow = (props) => {
      const { field_ref } = props;
      const field_index = getFieldIndex(field_ref);

      return (
        <>
          {field_index > -1 && (
            <>
              <strong>{`${fields[field_index].reagent_fieldList[0].name}: `}</strong>
              {`${fields[field_index].data || ""}`}
            </>
          )}
        </>
      );
    };

    const uniid_ind = getFieldIndex("uniprotid");
    const qc_ind = getFieldIndex("sampleqc");
    const sequence = getFieldIndex("sequence");
    // const genbank = getFieldIndex("genbank");

    return (
      <>
        <ul className="paragraph custom-fields">
          <li>
            {uniid_ind > -1 && (
              <>
                <strong>{`${fields[uniid_ind].reagent_fieldList[0].name}: `}</strong>
                <Link
                  href={`https://www.uniprot.org/uniprot/${fields[uniid_ind].data}`}
                  target="_blank"
                >{`${fields[uniid_ind].data || ""}`}</Link>
              </>
            )}
          </li>
          <li>
            <SpecRow field_ref="expression" />
          </li>
          <li>
            <strong>{`Construct ID: `}</strong>
            {`${reagent.sku || ""}`}
          </li>
          <li>
            <SpecRow field_ref="vector" />
          </li>
          <li>
            <SpecRow field_ref="purification_system" />
          </li>
          <li>
            <SpecRow field_ref="mwt" />
          </li>
          <li>
            {sequence > -1 && fields[sequence].data && (
              <>
                <strong>{`${fields[sequence].reagent_fieldList[0].name}: `}</strong>
                <br />
                <p className="amino-sequence-box">{`${
                  fields[sequence].data || ""
                }`}</p>
              </>
            )}
          </li>
        </ul>
        {qc_ind > -1 && fields[qc_ind].data && (
          <div className="sample-img">
            <Typography variant="h6" paragraph>
              {fields[qc_ind].reagent_fieldList[0].name}
            </Typography>

            <img src={JSON.parse(fields[qc_ind].data).url} alt="sample" />
          </div>
        )}
      </>
    );
  };

  return (
    <MainContainer theme={theme}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={8}>
          <Link
            className="btn-back paragraph"
            onMouseDown={(e) => {
              e.preventDefault();
              stepRequestCb(SEARCH_STEP);
            }}
          >
            {`< Back to Search`}
          </Link>
          <Typography variant="h1" paragraph className="step-title upper-case">
            {reagent.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {reagent.short}
          </Typography>
          {reagent.reagent_field_dataList && (
            <>
              <br />
              <CustomFields fields={reagent.reagent_field_dataList} />
            </>
          )}
          {is_loading && (
            <div className="progress-container">
              <CircularProgress />
            </div>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <BasketBtn
            className="paragraph btn-basket"
            stepRequestCb={stepRequestCb}
            basket={cur_data.basket}
          />
          {reagent.id && (
            <Paper elevation={3} className="selection-paper">
              <Typography variant="body1" paragraph>
                <strong>Select this reagent</strong>
                <br />
                You can request the amount you need later
              </Typography>
              {is_selected && (
                <div className="success-feedback paragraph">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="2x"
                    color="#78b62d"
                  />
                  <Typography variant="body2" component="span">
                    <strong>Added to selection</strong>
                  </Typography>
                </div>
              )}
              <Button
                variant={is_selected ? "outlined" : "contained"}
                color={is_selected ? "default" : "primary"}
                className="paragraph"
                fullWidth
                onMouseDown={(e) => editBasketCb(reagent)}
              >
                {is_selected ? "Remove from selection" : "Add to selection"}
              </Button>
              {is_selected && (
                <SelectedUI theme={theme}>
                  <div className="divider"></div>
                  <Typography variant="body1" paragraph>
                    This reagent has been added to your selection
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onMouseDown={(e) => stepRequestCb(BASKET_STEP)}
                  >
                    View your selection
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onMouseDown={(e) => stepRequestCb(SEARCH_STEP)}
                  >
                    Find more reagents
                  </Button>
                </SelectedUI>
              )}
              <Link
                target="_blank"
                href="https://covid19proteinportal.org/faq.html"
              >
                Need help?
              </Link>
            </Paper>
          )}
        </Grid>
      </Grid>
    </MainContainer>
  );
};

ItemDetailsStep.propTypes = {
  cur_data: PropTypes.object.isRequired,
  item_data: PropTypes.object.isRequired,
  stepRequestCb: PropTypes.func.isRequired,
  getDetailsCb: PropTypes.func.isRequired,
  editBasketCb: PropTypes.func.isRequired,
};

export default ItemDetailsStep;

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .btn-back {
    text-transform: none;
    font-size: 16px;
    font-weight: 500;
    color: #535050;
    display: block;
  }

  .btn-basket {
    margin-bottom: 50px;
  }

  .selection-paper {
    padding: ${(p) => p.theme.spacing(2)}px;

    .MuiButtonBase-root {
      font-size: 21px;
      text-transform: none;
    }

    .MuiLink-root {
      font-size: 18px;
    }
  }

  .success-feedback {
    display: flex;
    align-items: center;

    .MuiTypography-root {
      color: #78b62d;
      font-size: 18px;
      margin-left: 1rem;
    }
  }

  .custom-fields {
    font-size: 18px;
    line-height: 28px;

    li {
      list-style: none;
    }
  }

  .amino-sequence-box {
    width: 100%;
    word-break: break-all;
    padding: 1rem;
    background-color: #f3f3f3;
    border: 1px solid #cacaca;
    line-height: 21px;
  }

  .sample-img {
    img {
      max-width: 100%;
    }
  }
`;

const SelectedUI = styled.div`
  .divider {
    border-top: 1px solid #e5e5e5;
    margin: ${(p) => p.theme.spacing(2)}px -${(p) => p.theme.spacing(2)}px;
  }

  button {
    margin-bottom: ${(p) => p.theme.spacing(2)}px;
  }
`;
