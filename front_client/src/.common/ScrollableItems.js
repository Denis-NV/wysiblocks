import React, { useState, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// GraphQL
import { useLazyQuery } from "@apollo/react-hooks";

// CSS
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";

// Utils
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

//

const ScrollableItems = ({ site, children, feed, updateCallback }) => {
  const theme = useTheme();
  const blockRef = useRef(null);
  const pagination = useRef({ cursor: 0, end: -1 });

  const [cursorToLoad, setCursorToLoad] = useState(0);

  useLayoutEffect(() => {
    if (
      blockRef.current.clientHeight + blockRef.current.offsetTop <
      window.innerHeight
    ) {
      setCursorToLoad(pagination.current.cursor);
    }
  }, [pagination.current.cursor]);

  // GraphQL handlers
  const onBlockFeedLoaded = data => {
    const [cursor, end] = updateCallback(data);

    pagination.current.end = end;
    pagination.current.cursor = Math.min(cursor, end);
  };

  const onBlockFeedError = error => {
    console.log(`Error! ${error.message}`);
  };

  const onScroll = y => {
    if (
      window.innerHeight -
        y +
        theme.custom.itemFeed.offset -
        blockRef.current.offsetTop >=
      blockRef.current.clientHeight
    ) {
      if (pagination.current.cursor !== pagination.current.end)
        setCursorToLoad(pagination.current.cursor);
    }
  };

  const [getBlocks, { loading }] = useLazyQuery(feed, {
    onCompleted: onBlockFeedLoaded,
    onError: onBlockFeedError
  });

  // Scroll HOOK and logic
  useScrollPosition(({ currPos }) => onScroll(currPos.y), [], null, false, 300);

  if (cursorToLoad === pagination.current.cursor) {
    setCursorToLoad(-1);

    if (pagination.current.cursor !== pagination.current.end) {
      getBlocks({
        variables: {
          site_id: site.site_id,
          fromIndex: pagination.current.cursor,
          first: theme.custom.itemFeed.first
        }
      });
    }
  }

  //

  return (
    <BlocksContainer ref={blockRef}>
      {children}
      {loading && <p>Loading more blocks data...</p>}
    </BlocksContainer>
  );
};

ScrollableItems.propTypes = {
  site: PropTypes.object.isRequired,
  feed: PropTypes.object.isRequired,
  updateCallback: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    site: state.Site
  };
};

const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(ScrollableItems);

// #######################################
// CSS
// #######################################

const BlocksContainer = styled.div`
  /* background-color: #6c757d;
  color: white; */
`;
