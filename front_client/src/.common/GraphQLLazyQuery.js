import React from "react";
import PropTypes from "prop-types";

// GraphQL
import { useLazyQuery } from "@apollo/react-hooks";

const GraphQLLazyQuery = (props) => {
  const {
    children,
    completeCb,
    setQueryTrigger,
    QUERY,
    variables,
    LoadingComp,
    ErrorComp,
  } = props;

  const abortController = React.useRef(new window.AbortController());
  const load_requested = React.useRef();

  React.useEffect(() => {
    abortController.current =
      abortController.current || new window.AbortController();

    return () => {
      // cleanup
      abortController.current.abort();
      abortController.current = null;
    };
  }, []);

  const [triggerFunction, { loading, error }] = useLazyQuery(QUERY, {
    variables: variables,
    errorPolicy: "all",
    fetchPolicy: "network-only",
    context: {
      fetchOptions: { signal: abortController.current.signal },
    },
    onCompleted: (data) => {
      load_requested.current = false;

      completeCb(data);
    },
  });

  setQueryTrigger(triggerFunction);

  return (
    <>{loading ? LoadingComp : error ? ErrorComp || error.message : children}</>
  );
};

GraphQLLazyQuery.propTypes = {
  completeCb: PropTypes.func.isRequired,
  setQueryTrigger: PropTypes.func.isRequired,
  QUERY: PropTypes.object.isRequired,
  variables: PropTypes.object,
  LoadingComp: PropTypes.object,
  ErrorComp: PropTypes.object,
};

export default GraphQLLazyQuery;
