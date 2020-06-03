import { navigate } from "@reach/router";

import {
  pushBlocksFrom,
  sortBlocksOnOrder,
  stripFields,
  createIdLookup,
  parseBlock,
  sortNav,
  applyThemeSettings,
} from "../../.common/DataUtils";

import {
  SET_SITE_DATA,
  SET_BLOCKS_DATA,
  SET_SITE_EDIT_MODE,
  SET_LOCKED_PAGE_ID,
  UPDATE_BLOCKS_DATA,
  UPDATE_SITE_BLOCK_DATA,
  UPDATE_THEME,
  SET_NAV_WARNING,
  RESET_BLOCKS_DATA,
} from "../Types";

/*
 * Centralized way of navigating the site. Enables page locking.
 */
export const navigateTo = (to) => (dispatch, getState) => {
  const locked_page_id = getState().Nav.locked_page_id;

  if (locked_page_id === "") {
    navigate(to);
  } else {
    dispatch({ type: SET_NAV_WARNING, payload: { show: true, path: to } });
  }
};

/*
 *
 */
export const togglePageLock = (lock = true) => (dispatch, getState) => {
  const site = getState().Site;
  const nav = getState().Nav;

  if (lock) {
    const locked_page = Object.entries(site.pages).find(
      ([, value]) => value.uri === nav.current_address
    );

    if (locked_page) {
      dispatch({
        type: SET_LOCKED_PAGE_ID,
        payload: locked_page[0],
      });
    } else {
      console.log(
        "WARNING!!! Current page ",
        nav.current_address,
        "does NOT exist!"
      );

      dispatch({ type: SET_LOCKED_PAGE_ID, payload: "" });
    }
  } else {
    dispatch({ type: SET_LOCKED_PAGE_ID, payload: "" });
  }
};

/*
 *
 */
export const setEditMode = (is_edit_mode, enforse = false) => (
  dispatch,
  getState
) => {
  if (enforse) {
    dispatch({ type: SET_SITE_EDIT_MODE, payload: is_edit_mode });
    dispatch({ type: SET_LOCKED_PAGE_ID, payload: "" });

    if (!is_edit_mode) dispatch({ type: RESET_BLOCKS_DATA, payload: null });
  } else dispatch({ type: SET_SITE_EDIT_MODE, payload: is_edit_mode });
};

/*
 *
 */
export const setSiteData = (data) => (dispatch, getState) => {
  if (data.siteItem) {
    const theme = getState().Theme;

    const site_blocks_lookup = createIdLookup(
      data.siteItem.site_blockList.map((item) => parseBlock(item))
    );
    const nav_items = sortNav(
      data.siteItem.navList.map((item) => stripFields(item, ["__typename"]))
    );
    const pages_lookup = createIdLookup(
      data.siteItem.pageList.map((item) => stripFields(item, ["__typename"]))
    );
    dispatch({
      type: SET_SITE_DATA,
      payload: { site_blocks_lookup, nav_items, pages_lookup },
    });

    if (data.siteItem.theme) {
      dispatch({
        type: UPDATE_THEME,
        payload: applyThemeSettings(
          theme,
          JSON.parse(atob(data.siteItem.theme))
        ),
      });
    }
  }
};

/*
 *
 */
export const setBlocksData = (page_id, data) => (dispatch, getState) => {
  const page_blocks_lookup = {
    [page_id]: data.page_blockList.map((item) => parseBlock(item)),
  };
  dispatch({
    type: SET_BLOCKS_DATA,
    payload: { page_blocks_lookup },
  });
};

/*
 *  Called upon any page block reordering request
 *  Only dispatches an action to update local state
 *  Remote state syncing is managed separately
 */
export const reorderBlocks = (page_id, blockId, delta) => (
  dispatch,
  getState
) => {
  const page = getState().Page;
  const cur_blocks = page.page_blocks[page_id];

  let moving_block = {};
  let new_blocks = cur_blocks.filter((block) => {
    if (block.id === blockId) {
      moving_block = { ...block };
      return null;
    } else return block;
  });

  const targ_order = Math.min(
    Math.max(0, moving_block.block_data.order + delta),
    cur_blocks.length - 1
  );

  if (moving_block.block_data.order !== targ_order && delta !== 0) {
    moving_block.block_data.order = targ_order;

    new_blocks = pushBlocksFrom(targ_order, delta, new_blocks);
    new_blocks.push(moving_block);
    new_blocks = sortBlocksOnOrder(new_blocks);

    dispatch(togglePageLock());

    dispatch({
      type: UPDATE_BLOCKS_DATA,
      payload: {
        page_blocks_lookup: { [page_id]: new_blocks },
        deleted_blocks: page.deleted_blocks,
      },
    });
  }
};

/*
 *
 */
export const createNewBlock = (block_data_set, page_id, index) => (
  dispatch,
  getState
) => {
  const page = getState().Page;

  const cur_blocks = page.page_blocks[page_id];
  const new_block = {
    id: `TEMP_${Date.now()}`,
    block_data: {
      order: index,
      page_id: parseInt(page_id),
      component: block_data_set.component,
      payload_ref: parseInt(block_data_set.payload_ref),
    },
    options_data: { ...block_data_set.init_data },
    payload_data: null,
  };

  let new_blocks = [...cur_blocks];

  new_blocks = pushBlocksFrom(index, 0, new_blocks);
  new_blocks.push(new_block);
  new_blocks = sortBlocksOnOrder(new_blocks);

  dispatch(togglePageLock());

  dispatch({
    type: UPDATE_BLOCKS_DATA,
    payload: {
      page_blocks_lookup: { [page_id]: new_blocks },
      deleted_blocks: page.deleted_blocks,
    },
  });
};

/*
 *
 */
export const replaceSiteBlock = (block_data_set, block_id) => (
  dispatch,
  getState
) => {
  const site = getState().Site;

  const cur_block = site.site_blocks[block_id];

  const new_block = {
    id: block_id,
    block_data: {
      id: parseInt(block_id),
      site_id: cur_block.block_data.site_id,
      order: cur_block.block_data.order,
      type: cur_block.block_data.type,
      component: block_data_set.component,
    },
    options_data: { ...block_data_set.init_data },
  };

  dispatch(togglePageLock());

  dispatch({
    type: UPDATE_SITE_BLOCK_DATA,
    payload: new_block,
  });
};

/*
 *
 */
export const updateBlock = (page_id, block_id, options) => (
  dispatch,
  getState
) => {
  const page = getState().Page;

  const cur_blocks = page.page_blocks[page_id];
  const block_index = cur_blocks.findIndex((block) => block.id === block_id);
  const new_block = { ...cur_blocks[block_index] };

  new_block.options_data = { ...new_block.options_data, ...options };

  let new_blocks = [...cur_blocks];
  new_blocks[block_index] = new_block;

  dispatch(togglePageLock());

  dispatch({
    type: UPDATE_BLOCKS_DATA,
    payload: {
      page_blocks_lookup: { [page_id]: new_blocks },
      deleted_blocks: page.deleted_blocks,
    },
  });
};

/*
 *
 */
export const updateSiteBlock = (block_id, options) => (dispatch, getState) => {
  const site = getState().Site;

  const cur_block = site.site_blocks[block_id];

  const new_block = { ...cur_block };

  new_block.options_data = { ...new_block.options_data, ...options };

  dispatch(togglePageLock());

  dispatch({
    type: UPDATE_SITE_BLOCK_DATA,
    payload: new_block,
  });
};

/*
 *
 */
export const deleteBlock = (page_id, block_id) => (dispatch, getState) => {
  const page = getState().Page;

  const new_blocks = sortBlocksOnOrder(
    page.page_blocks[page_id].filter((block) => block.id !== block_id)
  );

  let deleted_blocks = [...page.deleted_blocks];

  if (block_id.toString().substr(0, 4) !== "TEMP") {
    const block_to_delete = page.page_blocks[page_id].find(
      (block) => block.id === block_id
    );
    deleted_blocks.push(block_to_delete);
  }

  dispatch(togglePageLock());

  dispatch({
    type: UPDATE_BLOCKS_DATA,
    payload: {
      page_blocks_lookup: { [page_id]: new_blocks },
      deleted_blocks,
    },
  });
};
