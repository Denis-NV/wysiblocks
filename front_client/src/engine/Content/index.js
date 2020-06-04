import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// Apollo GraphQL
import { useQuery } from "@apollo/client";

import { PAGE_DATA } from "../../queries";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

// Components
import Block from "../Block";
import AddBlockBtn from "../../.common/AddBlockBtn";

// Default
const Content = (props) => {
  const { page_data, editor, item_id, className } = props;

  // Hooks
  const theme = useTheme();

  // Rendering
  const PageBlocks = () => {
    const { loading, error, data } = useQuery(PAGE_DATA, {
      variables: {
        id: page_data.id.toString(),
        live: !editor.is_edit_mode,
        draft: editor.is_edit_mode,
      },
    });

    if (loading) return <LinearProgress variant="query" color="primary" />;
    if (error) return <p>Error :(</p>;
    if (!data) return <p>No Page data was returned by the query</p>;

    const page = data.page || {};
    const page_blocks_data = page.page_blocks;

    if (!page_blocks_data)
      return (
        <p>
          No Page Blocks data was found for the page width id: {page_data.id}
        </p>
      );

    const blocks_data = page_blocks_data
      .map((page_block) => ({ ...page_block }))
      .sort((a, b) => a[editor.cur_key].order - b[editor.cur_key].order);

    return (
      <>
        {editor.is_edit_mode && (
          <AddBlockBtn index={0} page_id={page_data.id} is_top="true" />
        )}
        {blocks_data.length === 0 && (
          <Message theme={theme}>
            <Typography variant="subtitle1" color="textPrimary">
              No blocks for page{" "}
              <strong>
                <em>{page_data.title}</em>
              </strong>{" "}
              have yet been created.
              <br />
              Please switch to "EDIT" mode and start adding blocks.
            </Typography>
          </Message>
        )}
        {blocks_data.map((block_data, index) => {
          return (
            <React.Fragment key={block_data.id}>
              <Block
                block_data={block_data}
                page_id={page_data.id}
                page_item_id={item_id}
              />
              {editor.is_edit_mode && (
                <AddBlockBtn index={index + 1} page_id={page_data.id} />
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <MainContainer theme={theme} className={className}>
      {React.useMemo(
        () => (
          <PageBlocks />
        ),
        []
      )}
    </MainContainer>
  );
};

Content.propTypes = {
  editor: PropTypes.object.isRequired,
  page_data: PropTypes.object.isRequired,
  item_id: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
  };
};

export default connect(mapStateToProps, {})(Content);

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
