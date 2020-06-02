// CSS and MUI
import styled from "styled-components";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";

export const MainContainer = styled(BlockBaseLayout)`
  color: #535050;

  a {
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  a,
  .MuiTypography-h1 {
    color: #00749a;
  }

  .MuiTypography-h1 {
    font-size: 31px;
    font-weight: 600;
  }

  .MuiTypography-h2 {
    font-size: 28px;
    font-weight: 600;
    color: #303030;
  }

  .MuiTypography-h3 {
    font-size: 26px;
    font-weight: 600;
    color: #303030;
  }

  .MuiTypography-body1 {
    font-size: 18px;
  }

  .MuiButton-contained {
    color: white;
    text-transform: none;
    font-size: 16px;
  }

  .MuiButton-outlined {
    color: #76797b;
  }

  .MuiPaper-root {
    color: #535050;
  }

  .side-notes-header {
    font-size: 24px;
    font-weight: 600;
  }

  .limited-width {
    max-width: 630px;
  }

  .upper-case {
    text-transform: uppercase;
  }

  .shopping-item-title {
    font-size: 20px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .small-basket {
    padding: ${(p) => p.theme.spacing(2)}px;

    .MuiTypography-h6 {
      font-size: 22px;
      font-weight: 500;
    }

    button {
      text-transform: none;
      font-size: 21px;
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  .small-basket-item {
    text-transform: uppercase;
    border-bottom: 1px solid #e5e5e5;
  }

  .login-ui {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
    padding-top: 2rem;

    .MuiButton-root {
    }
  }

  .nav-btns {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    button {
      text-transform: none;
      font-size: 21px;
      padding-left: 2rem;
      padding-right: 2rem;
      margin-bottom: ${(p) => p.theme.spacing(2)}px;

      @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
        width: 100%;
      }
    }
  }

  .progress-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.25rem;
  }
`;
