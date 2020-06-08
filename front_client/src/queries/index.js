import { gql } from "@apollo/client";

// Queries
export const SITE_DATA = gql`
  query($role: String, $live: Boolean!, $draft: Boolean!) {
    sites(where: { role: $role }) {
      id

      live @skip(if: $draft) {
        title
        theme
      }
      draft @skip(if: $live) {
        title
        theme
      }

      site_blocks {
        id
        type
        is_live
        unpublished

        live @skip(if: $draft) {
          order
          component
          custom_map
        }
        draft @skip(if: $live) {
          order
          component
          custom_map
        }
      }

      pages {
        id
        uri
        is_live
        unpublished
        protected

        live @skip(if: $draft) {
          title
          header_hidden
          footer_hidden
        }

        draft @skip(if: $live) {
          title
          header_hidden
          footer_hidden
        }
      }
    }
  }
`;

export const PAGE_DATA = gql`
  query($id: ID!, $live: Boolean!, $draft: Boolean!) {
    page(id: $id) {
      page_blocks {
        id
        is_live
        unpublished
        component

        live @skip(if: $draft) {
          order
          custom_map
        }

        draft @skip(if: $live) {
          order
          custom_map
        }
      }
    }
  }
`;

export const PAGES = gql`
  query($live: Boolean!, $draft: Boolean!) {
    pages {
      id
      uri
      is_live
      unpublished
      protected

      live @skip(if: $live) {
        title
        header_hidden
        footer_hidden
      }

      draft @skip(if: $draft) {
        title
        header_hidden
        footer_hidden
      }
    }
  }
`;

export const NAV_ITEMS = gql`
  query($live: Boolean!, $draft: Boolean!) {
    navItems {
      id
      is_live
      unpublished
      page {
        uri
      }

      live @skip(if: $live) {
        lft
        rgt
        title
        body
      }

      draft @skip(if: $draft) {
        lft
        rgt
        title
        body
      }
    }
  }
`;

// Mutations

export const REPLACE_SITE_BLOCK = gql`
  mutation($id: ID!, $comp: String!, $order: Int!, $settings: JSON) {
    updateSiteBlock(
      input: {
        where: { id: $id }
        data: {
          unpublished: true
          draft: { order: $order, component: $comp, custom_map: $settings }
        }
      }
    ) {
      siteBlock {
        id
        type
        is_live
        unpublished

        draft {
          order
          component
          custom_map
        }
      }
    }
  }
`;

export const UPDATE_THEME = gql`
  mutation($id: ID!, $title: String!, $theme: JSON!) {
    updateSite(
      input: {
        where: { id: $id }
        data: { draft: { title: $title, theme: $theme } }
      }
    ) {
      site {
        id
        draft {
          title
          theme
        }
      }
    }
  }
`;

export const UPDATE_PAGE = gql`
  mutation(
    $id: ID!
    $uri: String!
    $title: String!
    $header_hidden: Boolean!
    $footer_hidden: Boolean!
  ) {
    updatePage(
      input: {
        where: { id: $id }
        data: {
          unpublished: true
          uri: $uri
          draft: {
            title: $title
            header_hidden: $header_hidden
            footer_hidden: $footer_hidden
          }
        }
      }
    ) {
      page {
        id
        uri
        is_live
        unpublished
        protected

        draft {
          title
          header_hidden
          footer_hidden
        }
      }
    }
  }
`;
