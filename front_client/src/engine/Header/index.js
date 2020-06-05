import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// Apollo GraphQl
import { useMutation } from "@apollo/client";

import { REPLACE_SITE_BLOCK } from "../../queries";

// CSS
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

// Components
import SiteBlockInstruments from "../../.common/SiteBlockInstruments";
import SiteBlockTypes from "../../.common/LeftDrawer/SiteBlockTypes";

// Deafault
const Header = (props) => {
  const { site_block, className, editor } = props;

  // Hooks
  const theme = useTheme();
  const SpecializedHeader = React.useRef({});
  const EditorContent = React.useRef();
  const [instr_visible, setInstrVisible] = React.useState(false);
  const [show_editor_draw, setShowEditorDraw] = React.useState(false);

  const [replaceBlock] = useMutation(REPLACE_SITE_BLOCK, {
    // update(cache, { data: { updateSiteBlock } }) {
    //   // const s_b = cache.readQuery({
    //   //   query: SITE_BLOCK,
    //   //   variables: {
    //   //     id: site_block.id,
    //   //     live: false,
    //   //     draft: true,
    //   //   },
    //   // });
    //   // const { sites } = cache.readQuery({
    //   //   query: SITE_DATA,
    //   //   variables: {
    //   //     role: window._env_.REACT_APP_SITE_ROLE,
    //   //     live: false,
    //   //     draft: true,
    //   //   },
    //   // });
    //   const fr = cache.readFragment({
    //     id: `SiteBlock:${site_block.id}`,
    //     fragment: gql`
    //       fragment MySiteBlock on SiteBlock {
    //         component
    //         draft
    //       }
    //     `,
    //     // data: {
    //     //   component: updateSiteBlock.siteBlock.component,
    //     //   draft: updateSiteBlock.siteBlock.draft,
    //     // },
    //   });
    //   // console.log(cache);
    //   // console.log(fr);
    //   // console.log(updateSiteBlock.siteBlock.component);
    //   // console.log(updateSiteBlock.siteBlock.draft);
    // },
  });

  // Handlers
  const replaceHeader = (item) => {
    replaceBlock({
      variables: {
        id: site_block.id,
        comp: item.component,
        order: site_block.draft.order,
        settings: item.init_data,
      },
    });
  };

  // Render
  return (
    <MainContainer
      theme={theme}
      className={className}
      onMouseEnter={() => {
        editor.is_edit_mode && setInstrVisible(true);
      }}
      onMouseLeave={() => {
        editor.is_edit_mode && setInstrVisible(false);
      }}
    >
      {editor.is_edit_mode && (instr_visible || show_editor_draw) && (
        <>
          <Drawer
            open={show_editor_draw}
            onClose={(e) => setShowEditorDraw(false)}
          >
            {EditorContent.current}
          </Drawer>
          <SiteBlockInstruments
            showEditorCb={(show) => setShowEditorDraw(show)}
            setEditorContent={(type) => {
              EditorContent.current =
                type === "replace" ? (
                  <SiteBlockTypes
                    type="header"
                    closeCallback={() => setShowEditorDraw(false)}
                    actionCallback={replaceHeader}
                  />
                ) : (
                  <div>Simple Header Settings</div>
                );
            }}
          />
        </>
      )}
      {React.useMemo(() => {
        const component = site_block[editor.cur_key].component;

        if (component) {
          SpecializedHeader.current[component] =
            SpecializedHeader.current[component] ||
            React.lazy(() => import(`../../header.blocks/${component}`));

          const CurSpecializedHeader = SpecializedHeader.current[component];

          return (
            <React.Suspense fallback={null}>
              <CurSpecializedHeader
                site_block={site_block}
                cur_data_key={editor.cur_key}
                showEditorCb={() => setShowEditorDraw(true)}
                hideEditorCb={() => setShowEditorDraw(false)}
                setEditorContent={(cont) => {
                  EditorContent.current = cont;
                }}
              />
            </React.Suspense>
          );
        } else {
          console.log(
            "NO SITE BLOCK COMPONENT HAD BEEN PROVIDED!!!",
            site_block.id,
            site_block.type
          );
          return null;
        }
      }, [site_block, editor.cur_key])}
    </MainContainer>
  );
};

Header.propTypes = {
  site_block: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
  };
};

export default connect(mapStateToProps, {})(Header);

// #######################################
// CSS
// #######################################

const MainContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: ${(p) => p.theme.zIndex.header};
`;
