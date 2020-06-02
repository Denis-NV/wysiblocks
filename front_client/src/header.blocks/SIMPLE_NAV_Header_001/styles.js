// CSS and MUI
import styled from "styled-components";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";

export const MainContainer = styled.div`
  background-color: ${(p) => p.theme.palette.background.default};
  box-shadow: ${(p) => p.theme.shadows[3]};
`;

export const ContentContainer = styled(BlockBaseLayout)`
  /* Put your component's root level styles here */

  padding-top: 0;
  padding-bottom: 0;

  height: 92px;
  display: flex;

  figure {
    height: 100%;
    display: flex;
    width: 15%;
    min-width: 75px;

    & > img {
      height: 100%;
      width: 100%;
      cursor: pointer;
      object-fit: contain;
    }
  }

  nav {
    height: 100%;
    flex: 1;

    color: green;

    & > ul {
      height: 100%;
      display: flex;
      justify-content: center;
    }
  }
`;

export const NavItem = styled.li`
  display: inline-block;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  color: ${(p) => p.color};
  border-bottom: ${(p) => (p.active ? 2 : 0) + "px solid " + p.color};
  transition: all ${(p) => p.duration + "ms " + p.ease};

  > a {
    cursor: pointer;
    color: ${(p) => p.color};
    font-weight: 500;
    margin-bottom: ${(p) => (p.active ? "-2px" : 0)};
    transition: all ${(p) => p.duration + "ms " + p.ease};
  }

  &:hover {
    border-bottom: 3px solid ${(p) => p.color};
    transition: all ${(p) => p.duration + "ms " + p.ease};

    > a {
      margin-bottom: -3px;
      transition: all ${(p) => p.duration + "ms " + p.ease};
    }
  }
`;
