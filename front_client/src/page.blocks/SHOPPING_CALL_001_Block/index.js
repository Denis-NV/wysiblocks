import React from "react";
import PropTypes from "prop-types";

import { withPageBlockUtils } from "../../.common/BlockUtils";

// GraphQL
import { REAGENTS_SEARCH, REAGENT_DETAILS, CALL } from "../../queries";

// Redux
import {
  setShoppingCallData,
  editShoppingCallBasket,
  editShoppingCallForm,
  submitShoppingCallApplication,
  setShoppingCallUIState,
} from "../../redux/actions/UserActions";

// CSS and MUI
import { MainContainer } from "./styles";

// Utils
import {
  DETAILS_STEP,
  BASKET_STEP,
  FORM_STEP,
  REVIEW_STEP,
  TERMS_STEP,
} from "./const";
import GraphQLLazyQuery from "../../.common/GraphQLLazyQuery";
import { useKeycloak } from "@react-keycloak/web";

// Components
import Settings from "./Settings";
import Typography from "@material-ui/core/Typography";

import ItemSearchStep from "./ItemSearchStep";
import ItemDetailsStep from "./ItemDetailsStep";
import BasketStep from "./BasketStep";
import ApplicationFormStep from "./ApplicationFormStep";
import ReviewStep from "./ReviewStep";
import TermsStep from "./TermsStep";
import { Button } from "@material-ui/core";

// Default
const SHOPPING_CALL_001_Block = (props) => {
  const {
    options,
    setEditorContent,
    user,
    setShoppingCallData,
    editShoppingCallBasket,
    editShoppingCallForm,
    submitShoppingCallApplication,
    setShoppingCallUIState,
  } = props;

  let searchReagents = () => {};
  let getReagentDetails = () => {};
  let getCallData = () => {};

  // Hooks
  const [keycloak] = useKeycloak();
  const application = React.useRef();

  const [search_data, setSearchData] = React.useState({});
  const [view_item_data, setViewItemData] = React.useState({});
  const [call_data, setCallData] = React.useState({});

  // If call_id provided, make sure an old application is loaded or a new one created
  if (options.call_id) {
    application.current = user.shopping_calls_applications[options.call_id];

    if (!application.current) setShoppingCallData(options.call_id);
  }

  // Handlers
  const onStepRequest = (step) => {
    setShoppingCallData(options.call_id, "step", step);
  };

  // Render
  setEditorContent(Settings);

  const getCurrentStepComp = (cur_data) => {
    switch (cur_data.step) {
      case DETAILS_STEP:
        return (
          <ItemDetailsStep
            cur_data={cur_data}
            stepRequestCb={onStepRequest}
            getDetailsCb={(id) => {
              setShoppingCallUIState(options.call_id, "details", true);

              getReagentDetails({ variables: { id: id } });
            }}
            editBasketCb={(item) =>
              editShoppingCallBasket(options.call_id, item)
            }
            item_data={view_item_data}
          />
        );
      case BASKET_STEP:
        return (
          <BasketStep
            cur_data={cur_data}
            stepRequestCb={onStepRequest}
            editBasketCb={(item) =>
              editShoppingCallBasket(options.call_id, item)
            }
            itemViewCb={(id) => {
              setShoppingCallData(options.call_id, "view_item_id", id);
              setViewItemData({});
            }}
          />
        );
      case FORM_STEP:
        return (
          <ApplicationFormStep
            cur_data={cur_data}
            call_data={call_data}
            block_data={options}
            stepRequestCb={onStepRequest}
            getFieldsDataCb={() => {
              setShoppingCallUIState(options.call_id, "form", true);
              getCallData({ variables: { id: options.call_id } });
            }}
            editFormCb={(id, value) =>
              editShoppingCallForm(options.call_id, id, value)
            }
          />
        );
      case REVIEW_STEP:
        return (
          <ReviewStep
            cur_data={cur_data}
            call_data={call_data}
            stepRequestCb={onStepRequest}
            getFieldsDataCb={() => {
              setShoppingCallUIState(options.call_id, "form", true);
              getCallData({ variables: { id: options.call_id } });
            }}
          />
        );
      case TERMS_STEP:
        return (
          <TermsStep
            cur_data={cur_data}
            stepRequestCb={onStepRequest}
            onSetValueCb={(key, value) =>
              setShoppingCallData(options.call_id, key, value)
            }
            onSubmitCb={() =>
              submitShoppingCallApplication(
                options.call_id,
                options.basket_id,
                options.application_submit_url,
                keycloak.token
              )
            }
          />
        );
      default:
        return (
          <ItemSearchStep
            cur_data={cur_data}
            stepRequestCb={onStepRequest}
            search_data={search_data}
            onSearchCb={(str, first, from) => {
              setSearchData({ reagentFeed: {} });
              setShoppingCallUIState(options.call_id, "search", true);
              searchReagents({ variables: { key: str, first, from } });
            }}
            itemViewCb={(id) => {
              setShoppingCallData(options.call_id, "view_item_id", id);
              setViewItemData({});
            }}
          />
        );
    }
  };

  return (
    <MainContainer {...props}>
      <GraphQLLazyQuery
        setQueryTrigger={(trigger) => {
          searchReagents = trigger;
        }}
        QUERY={REAGENTS_SEARCH}
        completeCb={(data) => {
          setShoppingCallUIState(options.call_id, "search", false);
          setSearchData(data);
        }}
      />
      <GraphQLLazyQuery
        setQueryTrigger={(trigger) => {
          getReagentDetails = trigger;
        }}
        QUERY={REAGENT_DETAILS}
        completeCb={(data) => {
          setShoppingCallUIState(options.call_id, "details", false);
          setViewItemData(data);
        }}
      />
      <GraphQLLazyQuery
        setQueryTrigger={(trigger) => {
          getCallData = trigger;
        }}
        QUERY={CALL}
        completeCb={(data) => {
          setShoppingCallUIState(options.call_id, "form", false);
          setCallData(data);
        }}
      />
      <GraphQLLazyQuery
        setQueryTrigger={(trigger) => {
          getCallData = trigger;
        }}
        QUERY={CALL}
        completeCb={(data) => {
          setShoppingCallUIState(options.call_id, "form", false);
          setCallData(data);
        }}
      />
      {options.call_id ? (
        application.current && keycloak.authenticated ? (
          getCurrentStepComp(application.current)
        ) : (
          <div className="login-ui">
            <Typography variant="body1" paragraph align="center">
              Please log in to search for reagents
            </Typography>
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => keycloak.login()}
            >
              Log in
            </Button>
          </div>
        )
      ) : (
        <Typography variant="body1">Please specify Call ID</Typography>
      )}
    </MainContainer>
  );
};

// Props, expected by the component
SHOPPING_CALL_001_Block.propTypes = {
  site: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  block_id: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onContentUpdate: PropTypes.func.isRequired,
};

export default withPageBlockUtils(
  (state) => ({
    site: state.Site,
    user: state.User,
  }),
  {
    setShoppingCallData,
    editShoppingCallBasket,
    editShoppingCallForm,
    submitShoppingCallApplication,
    setShoppingCallUIState,
  }
)(SHOPPING_CALL_001_Block);
