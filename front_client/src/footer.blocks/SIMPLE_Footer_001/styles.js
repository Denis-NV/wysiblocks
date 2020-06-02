// CSS and MUI
import styled from "styled-components";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";

export const MainContainer = styled.div`
  /* Put your component's full-width background styles here */

  background-color: ${(p) => p.theme.palette.grey[400]};
`;

export const ContentContainer = styled(BlockBaseLayout)`
  /* Put your component's content root level styles here */

  /* padding-top: 0;
  padding-bottom: 0; */
`;
