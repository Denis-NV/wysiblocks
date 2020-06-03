import axios from "axios";

import {
  TOGGLE_DATA_SAVING_UI,
  SET_CONTENT_BLOCK_TYPES_DATA,
  SET_SITE_BLOCK_TYPES_DATA,
  UPDATE_PAGES_DATA,
  UPDATE_NAV_DATA,
  SET_LOCKED_PAGE_ID,
  RESET_BLOCKS_DATA,
  RESET_BLOCKS_TO_DELETE,
} from "../Types";

import { stripFields, createIdLookup, sortNav } from "../../.common/DataUtils";

import PageBlockTypes from "../../data/PageBlockTypes.json";
import SiteBlockTypes from "../../data/SiteBlockTypes.json";

/*
 *
 */
export const getContentBlockTypes = () => (dispatch) => {
  dispatch({ type: SET_CONTENT_BLOCK_TYPES_DATA, payload: PageBlockTypes });
};

/*
 *
 */
export const getSiteBlockTypes = (type) => (dispatch) => {
  const type_block_types = SiteBlockTypes.filter((item) => item.type === type);

  dispatch({
    type: SET_SITE_BLOCK_TYPES_DATA,
    payload: { type, items: type_block_types },
  });
};

export const commitPageEdits = () => (dispatch, getState) => {
  const site = getState().Site;
  const blocksRequests = [];

  Object.entries(site.site_blocks).forEach(([, value]) => {
    const block_to_save = {
      ...value.block_data,
      options: value.options_data
        ? btoa(JSON.stringify(value.options_data))
        : "",
    };

    blocksRequests.push(
      axios.patch(
        `${window._env_.REACT_APP_MAIN_API_URL}/site_block/${block_to_save.id}`,
        block_to_save
      )
    );
  });

  return axios
    .all(blocksRequests)
    .then((resArray) => {
      const blocks_res_data = resArray.map((res) => res.data);
      console.log("SITE BLOCKS Successfully SAVED!:", blocks_res_data);

      dispatch(commitPageBlockEdits());
    })
    .catch((err) => console.log(err));
};

/*
 *
 */
export const commitPageBlockEdits = () => (dispatch, getState) => {
  const page = getState().Page;
  const nav = getState().Nav;

  const postUpdates = () => {
    const blocks_to_save = page.page_blocks[nav.locked_page_id];

    if (blocks_to_save) {
      let blocksRequests = [];

      blocks_to_save.forEach((block) => {
        const block_to_save = {
          ...block.block_data,
          options: block.options_data
            ? btoa(JSON.stringify(block.options_data))
            : "",
        };

        if (block.id.toString().substring(0, 4) === "TEMP") {
          blocksRequests.push(
            axios.post(
              `${window._env_.REACT_APP_MAIN_API_URL}/page_block`,
              block_to_save
            )
          );
        } else {
          blocksRequests.push(
            axios.patch(
              `${window._env_.REACT_APP_MAIN_API_URL}/page_block/${block.id}`,
              block_to_save
            )
          );
        }
      });

      return axios
        .all(blocksRequests)
        .then((resArray) => {
          const blocks_res_data = resArray.map((res) => res.data);
          console.log("BLOCKS Successfully SAVED!:", blocks_res_data);

          dispatch({ type: RESET_BLOCKS_DATA, payload: null });

          dispatch({ type: SET_LOCKED_PAGE_ID, payload: "" });

          dispatch({ type: TOGGLE_DATA_SAVING_UI, payload: false });
        })
        .catch((err) => console.log(err));
    }
  };

  //
  //

  const deleted_blocks = page.deleted_blocks;

  if (deleted_blocks.length > 0) {
    dispatch({ type: TOGGLE_DATA_SAVING_UI, payload: true });

    dispatch(deletePageBlocks(deleted_blocks, postUpdates));
  } else {
    dispatch({ type: TOGGLE_DATA_SAVING_UI, payload: true });

    postUpdates();
  }
};

/*
 *
 */
export const deletePageBlocks = (deleted_blocks, then) => (dispatch) => {
  const delete_requests = deleted_blocks.map((block) =>
    axios.delete(
      `${window._env_.REACT_APP_MAIN_API_URL}/page_block/${block.id}`
    )
  );

  return axios
    .all(delete_requests)
    .then((resArray) => {
      console.log("BLOCKS Successfully DELETED!:", deleted_blocks);

      dispatch({ type: RESET_BLOCKS_TO_DELETE, payload: null });

      if (then) then();
    })
    .catch((err) => console.log(err));
};

/*
 *
 */
export const commitPagesEdits = (new_pages, new_nav) => (
  dispatch,
  getState
) => {
  const site = getState().Site;
  const page = getState().Page;

  const cur_pages = site.pages;

  const cur_ids = Object.entries(cur_pages).map(([key, value]) => key);
  const new_ids = Object.entries(new_pages).map(([key, value]) => key);
  const ids_to_delete = cur_ids.filter((id) => !new_ids.includes(id));

  console.log("commitPagesEdits", cur_ids, new_ids, ids_to_delete);
  const postUpdates = () => {
    const page_requests = [];

    for (const id in new_pages) {
      const page_to_save = { ...new_pages[id], site_id: site.site_id };

      if (id.toString().substring(0, 4) === "TEMP") {
        page_requests.push(
          axios.post(
            `${window._env_.REACT_APP_MAIN_API_URL}/page`,
            page_to_save
          )
        );
      } else {
        page_requests.push(
          axios.patch(
            `${window._env_.REACT_APP_MAIN_API_URL}/page/${id}`,
            page_to_save
          )
        );
      }
    }

    return axios
      .all(page_requests)
      .then((resArray) => {
        const pages_res_data = resArray.map((res) => res.data);
        console.log("PAGES Successfully SAVED!:", pages_res_data);

        dispatch({
          type: UPDATE_PAGES_DATA,
          payload: createIdLookup(
            pages_res_data.map((page) => stripFields(page, ["site_id"]))
          ),
        });
        dispatch(commitNavEdits(new_nav));
      })
      .catch((err) => console.log(err));
  };

  //
  //

  if (ids_to_delete.length > 0) {
    dispatch({ type: TOGGLE_DATA_SAVING_UI, payload: true });

    const delete_requests = ids_to_delete.map((id) =>
      axios.delete(`${window._env_.REACT_APP_MAIN_API_URL}/page/${id}`)
    );

    return axios
      .all(delete_requests)
      .then((resArray) => {
        console.log("PAGES Successfully DELETED!:", ids_to_delete);

        let deleted_blocks = [...page.deleted_blocks];

        // TODO: Blocks of any deleted pages must be deleted on the back end,
        // as the front end only knows block id's of the visited pages, and
        // the UI allows to delete any pages
        ids_to_delete.forEach((page_id) => {
          const page_blocks = page.page_blocks[page_id];

          if (page_blocks) {
            page_blocks.forEach((block) => {
              if (block.id.toString().substr(0, 4) !== "TEMP")
                deleted_blocks.push(block);
            });
          } else {
            console.log(
              `WARNING!!! Blocks of the deleted page ${page_id} have not been automatically deleted, as this is the back end job.`
            );
          }
        });

        if (deleted_blocks.length > 0)
          dispatch(deletePageBlocks(deleted_blocks, postUpdates));
        else postUpdates();
      })
      .catch((err) => console.log(err));
  } else {
    dispatch({ type: TOGGLE_DATA_SAVING_UI, payload: true });

    postUpdates();
  }
};

/*
 *
 */
export const commitNavEdits = (new_nav) => (dispatch, getState) => {
  const site = getState().Site;

  const cur_nav = site.nav;

  const cur_ids = cur_nav.map((item) => item.id);
  const new_ids = new_nav.map((item) => item.id);
  const ids_to_delete = cur_ids.filter((id) => !new_ids.includes(id));
  console.log("commitNavEdits", cur_ids, new_ids, ids_to_delete);

  const postUpdates = () => {
    const nav_requests = [];

    new_nav.forEach((item) => {
      const item_to_save = { ...item, site_id: site.site_id };

      if (item.id.toString().substring(0, 4) === "TEMP") {
        nav_requests.push(
          axios.post(
            `${window._env_.REACT_APP_MAIN_API_URL}/nav`,
            stripFields(item_to_save, ["id"])
          )
        );
      } else {
        nav_requests.push(
          axios.patch(
            `${window._env_.REACT_APP_MAIN_API_URL}/nav/${item_to_save.id}`,
            item_to_save
          )
        );
      }
    });

    return axios
      .all(nav_requests)
      .then((resArray) => {
        const nav_res_data = resArray.map((res) => res.data);
        console.log("NAV Successfully SAVED!:", nav_res_data);

        dispatch({
          type: UPDATE_NAV_DATA,
          payload: sortNav(
            nav_res_data.map((item) => stripFields(item, ["site_id"]))
          ),
        });
        dispatch({ type: TOGGLE_DATA_SAVING_UI, payload: false });
      })
      .catch((err) => console.log(err));
  };

  if (ids_to_delete.length > 0) {
    const delete_requests = ids_to_delete.map((id) =>
      axios.delete(`${window._env_.REACT_APP_MAIN_API_URL}/nav/${id}`)
    );

    return axios
      .all(delete_requests)
      .then((resArray) => {
        console.log("NAV ITEMS Successfully DELETED!:", ids_to_delete);

        postUpdates();
      })
      .catch((err) => console.log(err));
  } else {
    postUpdates();
  }
};

/*
 *
 */
export const commitThemeEdits = (new_settings) => (dispatch, getState) => {
  // const site = getState().Site;
  // const theme = getState().Theme;
  // return axios
  //   .patch(`${window._env_.REACT_APP_MAIN_API_URL}/site/${site.site_id}`, {
  //     theme: btoa(JSON.stringify(new_settings)),
  //   })
  //   .then((res) => {
  //     console.log("Theme Settings Successfully saved!:", new_settings);
  //     const new_theme = applyThemeSettings(theme, new_settings);
  //     dispatch({ type: UPDATE_THEME, payload: new_theme });
  //     dispatch(loadGoogleFont(theme));
  //   })
  //   .catch((err) => console.log(err));
};

/*
 *
 */
