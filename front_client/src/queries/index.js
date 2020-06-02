import { gql } from "@apollo/client";

// Queries
export const LIVE_SITE_DATA = gql`
  query($role: String) {
    sites(where: { role: $role }) {
      settings {
        live {
          title
          theme
        }
      }

      site_blocks {
        type
        component
        settings {
          live {
            order
            custom_map
          }
        }
      }
    }
  }
`;

// export const SITE_DATA = gql`
//   query($id: ID!) {
//     siteItem(id: $id) {
//       theme
//       isAdmin
//       site_blockList {
//         id
//         site_id
//         order
//         component
//         type
//         options
//       }
//       navList {
//         id
//         to
//         name
//         lft
//         rgt
//       }
//       pageList {
//         id
//         uri
//         title
//         header_hidden
//         footer_hidden
//       }
//     }
//   }
// `;

export const PAGE_DATA = gql`
  query($pageId: Int!, $first_pr: Int!) {
    page_blockList(filters: { page_id: $pageId }) {
      id
      component
      payload_ref
      page_id
      order
      options
      payload {
        ... on NewsPayloadType {
          id
          type
          newsFeed(first: $first_pr) {
            nodes {
              id
              title
              image
              uri
            }
          }
        }
        ... on EventPayloadType {
          id
          type
          eventFeed(first: $first_pr) {
            nodes {
              id
              title
              uri
              date
              closes
              location
              country
            }
          }
        }
      }
    }
  }
`;

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
