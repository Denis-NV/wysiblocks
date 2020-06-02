import styled from "styled-components";

export const MainContainer = styled.div`
  min-width: 300px;
  position: relative;

  hr {
    border: 0.1px solid rgba(37, 37, 37, 0.2);
    border-radius: 2px;
    margin-bottom: ${(p) => p.theme.spacing(2)}px;
  }
`;

export const SearchResults = styled.div`
  border: 1px solid rgba(37, 37, 37, 0.3);
  border-radius: ${(p) => p.theme.shape.borderRadius}px;

  position: absolute;
  z-index: 1;
  width: 100%;
  background: white;
`;

export const SearchField = styled.div`
  position: relative;

  .search-btn {
    position: absolute;
    top: 16px;
    right: 6px;
    opacity: 0.5;
  }

  .clear-btn {
    cursor: pointer;
  }
`;

export const SelectedFilesContainer = styled.ul`
  margin: ${(p) => p.theme.spacing(2)}px 0;
  max-width: 300px;

  list-style: none;

  .MuiChip-root {
    position: relative;
    transform: translate(0, 0);
    margin-right: ${(p) => p.theme.spacing(1)}px;
    margin-bottom: ${(p) => p.theme.spacing(1)}px;
  }

  .MuiChip-icon {
    cursor: pointer;
  }

  .MuiChip-label {
    max-width: 255px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
`;
