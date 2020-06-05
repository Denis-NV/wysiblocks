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
        component
        is_live
        unpublished

        live @skip(if: $draft) {
          order
          custom_map
        }
        draft @skip(if: $live) {
          order
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

// Mutations

export const REPLACE_SITE_BLOCK = gql`
  mutation($id: ID!, $comp: String!, $order: Int!, $settings: JSON) {
    updateSiteBlock(
      input: {
        where: { id: $id }
        data: {
          component: $comp
          unpublished: true
          draft: { order: $order, custom_map: $settings }
        }
      }
    ) {
      siteBlock {
        id
        type
        component
        is_live
        unpublished

        draft {
          order
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
