import React from "react";

// CSS
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

// Components
import BlockBaseLayout from "./BlockBaseLayout";

const BlockSkeleton = (props) => {
  const theme = useTheme();

  return (
    <MainContainer>
      <Box variant="rect" theme={theme} />
    </MainContainer>
  );
};

export default BlockSkeleton;

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)``;

const Box = styled(Skeleton)`
  height: 250px;
  margin: -${(p) => p.theme.spacing(4)}px 0;
`;
