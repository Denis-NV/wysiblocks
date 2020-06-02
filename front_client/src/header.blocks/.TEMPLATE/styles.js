// CSS and MUI
import styled from "styled-components";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";

export const MainContainer = styled.div`
  /* Put your component's full-width background styles here */

  background-color: ${(p) => p.theme.palette.background.default};
  box-shadow: ${(p) => p.theme.shadows[3]};
`;

export const ContentContainer = styled(BlockBaseLayout)`
  /* Put your component's content root level styles here */

  padding-top: 0;
  padding-bottom: 0;
`;
