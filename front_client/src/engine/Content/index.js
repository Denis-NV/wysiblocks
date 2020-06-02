import React from "react";
import PropTypes from "prop-types";

// Redux
import { setBlocksData } from "../../redux/actions/LocalActions";
import { connect } from "react-redux";

// GraphQL
import { PAGE_DATA } from "../../queries";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

// Components
import Block from "../Block";
import AddBlockBtn from "../../.common/AddBlockBtn";
import GraphQLLazyQuery from "../../.common/GraphQLLazyQuery";

// Default
const Content = (props) => {
  const { page_data, editor, page, item_id, setBlocksData, className } = props;

  let getPageData = () => {};

  // Hooks
  const theme = useTheme();
  const page_data_requested = React.useRef();

  React.useLayoutEffect(() => {
    if (!page_data_requested.current && !page.page_blocks[page_data.id]) {
      page_data_requested.current = true;

      getPageData();
    }
  }, [page_data.id, page.page_blocks]);

  // Rendering
  return (
    <MainContainer theme={theme} className={className}>
      <GraphQLLazyQuery
        setQueryTrigger={(trigger) => (getPageData = trigger)}
        QUERY={PAGE_DATA}
        variables={{
          pageId: page_data.id,
          first_pr: 3,
        }}
        completeCb={(data) => {
          page_data_requested.current = false;

          setBlocksData(page_data.id, data);
        }}
        LoadingComp={<LinearProgress variant="query" color="primary" />}
        ErrorComp={null}
      >
        <>
          {React.useMemo(() => {
            const page_title = page_data.title;
            const page_id = page_data.id;
            const page_id_str = page_id.toString();
            const is_edit_mode = editor.is_edit_mode;
            const page_blocks = page.page_blocks || {};
            const blocksData = page_blocks[page_id];

            return (
              <>
                {page_blocks[page_id] ? (
                  <>
                    {is_edit_mode && (
                      <AddBlockBtn
                        index={0}
                        page_id={page_id_str}
                        is_top="true"
                      />
                    )}
                    {blocksData.length === 0 && (
                      <Message theme={theme}>
                        <Typography variant="subtitle1" color="textPrimary">
                          No blocks for page{" "}
                          <strong>
                            <em>{page_title}</em>
                          </strong>{" "}
                          have yet been created.
                          <br />
                          Please switch to "EDIT" mode and start adding blocks.
                        </Typography>
                      </Message>
                    )}
                    {blocksData.map((block_data_set, index) => {
                      return (
                        <React.Fragment key={block_data_set.id}>
                          <Block
                            block_data_set={block_data_set}
                            page_id={page_id_str}
                            page_item_id={item_id}
                          />
                          {is_edit_mode && (
                            <AddBlockBtn
                              index={index + 1}
                              page_id={page_id_str}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </>
                ) : null}
              </>
            );
          }, [theme, page_data, item_id, editor, page.page_blocks])}
        </>
      </GraphQLLazyQuery>
    </MainContainer>
  );
};

Content.propTypes = {
  editor: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  setBlocksData: PropTypes.func.isRequired,
  page_data: PropTypes.object.isRequired,
  item_id: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
    page: state.Page,
  };
};

export default connect(mapStateToProps, { setBlocksData })(Content);

// #######################################
// CSS
// #######################################

const MainContainer = styled.main`
  .MuiLinearProgress-colorPrimary {
    background-color: ${(p) => p.theme.palette.grey[400]};
  }

  .MuiLinearProgress-barColorPrimary {
    background-color: ${(p) => p.theme.palette.grey[600]};
  }
`;

const Message = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: center;

  & > * {
    max-width: 800px;
    text-align: center;
    opacity: 0.5;
  }
`;
