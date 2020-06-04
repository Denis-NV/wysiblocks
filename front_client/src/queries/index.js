import { gql } from "@apollo/client";

// Queries
export const SITE_DATA = gql`
  query($role: String, $live: Boolean!, $draft: Boolean!) {
    sites(where: { role: $role }) {
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
        is_deleted
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
        is_deleted
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
        is_deleted
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
        is_deleted
        unpublished

        draft {
          order
          custom_map
        }
      }
    }
  }
`;

//
//

export const NEWS_FEED = gql`
  query($fromIndex: Int!, $first: Int!, $tags: [String]) {
    newsFeed(first: $first, fromIndex: $fromIndex, filters: { tags: $tags }) {
      totalCount
      pageInfo {
        nextIndex
        hasNextSlice
      }
      nodes {
        id
        title
        uri
        abstract
      }
    }
  }
`;

export const NEWS = gql`
  query($uri: String!) {
    newsList(filters: { uri: $uri }) {
      title
      content
      image
    }
  }
`;

export const EVENT_FEED = gql`
  query($fromIndex: Int!, $first: Int!, $tags: [String]) {
    eventFeed(first: $first, fromIndex: $fromIndex, filters: { tags: $tags }) {
      totalCount
      pageInfo {
        nextIndex
        hasNextSlice
      }
      nodes {
        id
        title
        uri
        abstract
        date
        closes
        registration_date
        registration_closes
        location
        country
      }
    }
  }
`;

export const EVENT = gql`
  query($uri: String!) {
    eventList(filters: { uri: $uri }) {
      title
      uri
      date
      closes
      registration_date
      registration_closes
      content
      contact_name
      contact_email
      location
      country
      lat
      lng
      timezone
      image
    }
  }
`;

export const DOCS_SEARCH = gql`
  query($key: String!) {
    documentList(filters: { title: $key, hidden: 0 }) {
      id
      title
      description
      filename
      added
      updated
      hidden
      download
    }
  }
`;

export const REAGENTS_SEARCH = gql`
  query($key: String!, $first: Int!, $from: Int!) {
    reagentFeed(
      first: $first
      fromIndex: $from
      filters: { hidden: false, search: $key }
    ) {
      totalCount
      pageInfo {
        endCursor
        nextIndex
        hasNextSlice
      }
      nodes {
        id
        sku
        name
        short
        available
        reagent_field_dataList {
          field_id
          data
          reagent_fieldList {
            ref
            name
          }
        }
      }
    }
  }
`;

export const REAGENT_DETAILS = gql`
  query($id: ID!) {
    reagentItem(id: $id) {
      id
      sku
      name
      short
      available
      reagent_field_dataList {
        field_id
        data
        reagent_fieldList {
          ref
          name
        }
      }
    }
  }
`;

export const CALL = gql`
  query($id: ID!) {
    callItem(id: $id) {
      id
      name
      short
      description
      guide
      open
      close
      call_fields_assocList {
        id
        title
        options
        required
        call_fieldsList {
          id
          title
          type
          options
        }
      }
    }
  }
`;
