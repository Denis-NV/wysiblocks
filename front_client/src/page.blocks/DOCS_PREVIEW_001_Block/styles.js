import styled from "styled-components";

import BlockBaseLayout from "../../.common/BlockBaseLayout";
import GlobalModal from "../../.common/GlobalModal";

export const MainContainer = styled(BlockBaseLayout)`
  .MuiButton-root {
    margin: ${(p) => p.theme.spacing(4)}px 0px;
  }
`;

export const FileBtns = styled.div`
  display: flex;

  .MuiButton-root {
    margin: ${(p) => p.theme.spacing(1)}px ${(p) => p.theme.spacing(1)}px 0 0;
  }
`;

export const DetailsModal = styled(GlobalModal)`
  max-width: 500px;
  max-height: inherit;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  button {
    display: block;
    margin: 2rem auto 0 auto;
  }
`;
