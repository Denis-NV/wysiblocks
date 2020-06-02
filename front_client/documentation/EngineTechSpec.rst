===========================================
Site Builder Engine Techincal Specification
===========================================

:Author:
  Denis Nemytov
:Version:
  $Revision: 1 $
:Copyroght:
  For internal use of InstructEric_ team

.. contents::

Fundamental Parameters
----------------------

- Max width 1280px [1]_
- Breakpoint

  + sm ``(max-width: 600px)`` [1]_
  + md ``(max-width: 960)`` [1]_
  + lg ``(max-width: 1280)`` [1]_

- Website follows *responsite* and **NOT** *adaptive* model
- Edit mode only works on desktop computers
  i.e. ``@media (pointer:fine)``
- Site works in two modes: *View* and *Edit*


Authentication and types of users
----------------------------------

  :TODO


Global site settings
--------------------

Pages and Navigation Setup
~~~~~~~~~~~~~~~~~~~~~~~~~~

:TODO

Theming
~~~~~~~

- Each ``site`` DB table entry has a ``theme`` field
  containing a JSON object

    ::

      "site": [
        {
          "id": 01,
          "theme": {
            "header_logo":"",
            "primary_color":"",
            "secondary_color":"",
            "main_font":""
          }
        },
        ...
      ]


- Hence following parameters can be customized

  + Header logo

  .. _primary color:

  + Primary site color

  + Secondary site color

  + Site font family


Underlying container structure
------------------------------

Schema
~~~~~~

    ::

      <App>
        <Root>
          <Header/>
          <PagesContainer>
            <Page>
              <Block/>
              <Block/>
              <Block/>
              ...
            </Pages>
          </PagesContainer>
          <EditingUIButton1>
          <EditingUIButton2>
          <EditingUIButton3>
          ...
        </Root>
        <PresentationLayer>
          <LeftDrawer/>
          <Modal/>
        </PresentationLayer>
      </App>

Explanation
~~~~~~~~~~~~

  ::

    App {
      position:relative;
      width: 100%;
      height: auto;
    }

    Root {
      position:relative;
      width: 100%;
      height: auto;
    }

    Header {
      position: fixed;
      width: 100%;
      height: [see Header section]
    }

    PagesContainer {
      width: 100%;
      height: auto;
      /*
      - If required, page switching can be animated
      - As the width is 100%, no layout columns are defined at either
      PagesContainer or Page level
      */
    }

    Block {
      width: 100%;
      height: auto;
      /*
      - Each block has an option of using BaseBlockLayout component,
        which defines a responsive 3 column layout
        More on that in Block Element description below
      */
    }

    EditingUIButton {
      position: absolute;
      /*
      - All buttons do NOT have a separate container inside Root
      container
      - Their position is defined by 'left' and 'bottom' properties.
      So it's relative to the left and bottom edges of a browser window.
      */
    }

    PresentationLayer {
      position: fixed;
      right: 0px;
      bottom: 0px;
      top: 0px;
      left: 0px;
      /*
      - displays its content on top of entire root container
      - Only one Drawer or Modal can be displayed at a time
      */
    }

Limitations
~~~~~~~~~~~

- No footer fixed to the bottom of the page
- No responsive / adaptive behaviour implemented at this top container level



Fundamental app building blocks
-------------------------------
App
~~~~~~

How it works
............
  :TODO

Data and State
...............

- This is where all the intial site data gets loaded via GraphQl query.
- This is done only once upon initial site load
- Later if any core site data (Nav, Pages, Theme  and etc.) gets updated,
  local stste gets persisted and refreshed via REST Api Point call

GraphQl query

  ::

    siteItem(id: $id) {
      theme
      navList {
        id
        to
        name
        lft
        rgt
      }
      pageList {
        id
        uri
        title
      }
    }

Layout Rules
............

  ::

    App {
      position: relative;
      width: 100%;
      height: auto;
    }

Limitations
...........
  :TODO



Header
~~~~~~

How it works
............

- Always at the top
- Background stretches to 100% of window width
- Height is specified in site's theme (see `Theming`_) [1]_
- Main children container

  + max-width = global site max-width [1]_
  + centered inside Header

- Background color is set to site `primary color`_

- It contains two child elements

  + *Logo*
  + *Nav*

- Logo

  + Takes up full height of the Header
  + Width scale proportionally, maintainig aspect ratio

- Nav

  + Displays flat one level horizontal, not wrapable list of page links,
    defined in site's `Pages and Navigation Setup`_
  + If there's not enough space to display all links, nav turns into a
    "burger" button that opens a right drawer with vertically listed menu
    items, when clicked.

Data and State
...............

  :TODO

Layout Rules
............

  ::

    Header {
      diplay:flex;
      justify-content:flex-start;
      /*
      Inside Header, Logo and Nav are positioned left to right
      and aligned to the left
      */
      Nav {
        flex:1;
        // Nav takes up all the width left by Logo
      }

      @media (max-width:$md) {
        Nav {
          diplay:none;
        }
        /*
        When there's not enough space to display all nav items in
        one line or the browser hit "md" breakpoint, Nav disappers and
        gets replaces by Nav Button, which is alligned to the right
        side of the Header
        */
      }
    }


Limitations
...........

- Doesn't change / resize on scroll
- Can't contain nested elements
- Curently doesn't support dynamic Header component loading, specified
  inside the ``site:theme:{...}``


Page
~~~~~~
How it works
............

- Page is essentially a container for Blocks_
- Each page mounting (adding and removing to the DOM) is controlled
  by a Router Library and is synced with a browser address URL value.
- So no more than one page ever gets loaded at a time


Data and State
...............

  - Page and all the page Blocks' data get's loaded upon page mount
    via GraphQl query, if that hasn't been already done on a previous
    visit
  - **IMPORTANT!!!** If any of the Page's Blocks_ state gets updated
    locally, new Page data gets fetched via GraphQl query after the
    updated Blocks_ state get's persisted via a REST API point call

GraphQl query

  ::

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
          ...
        }
      }

Layout Rules
............

Each page has a container ``<div>`` that has a top-padding set to a
dynamic value, equal to the Header_ height. All Blocks_ get attached
to that container

  ::

    Page {
      position: relative;
      width: 100%;
      height: auto;

      .container {
        position: relative;
        width: 100%;
        height: auto;
      }
    }

Limitations
...........

  :TODO


Blocks
~~~~~~
How it works
............

- Each Block component gets loaded and instanciated dynamically together
  with the current page, taking advantage or React dynamic import
  technic.
- Each Block can take advantage of BaseBlock Component for the purposes
  of its layout composition, which creates a 3 column layout

Data and State
...............

- Each block is being provided all the necessary data to render its
  content (including blocks that relay on separate microservices data)
  from the page that instanciated them by the means of a
  cleverlystructured GraphQL query

Layout Rules
............

- It is recommended that all the blocks use a BlockBaseLayout Component that
  would be responsible for the 3 column layout.
- All the actual blocks content in that case would go inside the middle
  column and each individual block should take care of the layout and
  responsive / adaptive behaviour of it's own content.

BlockBaseLayout Component

  ::

    <section>
      <aside/>
      <main>
        {block_content}
      </main>
      <aside/>
    </section>

    section {
      padding: 40px 0;
      display: flex;
    }

    aside {
      flex: 1;
    }

    main {
    width: [breakpoint.sm]

    @media (min-width: [breakpoint.md]px) {
      width: [breakpoint.md]px;
    }

Limitations
...........

  :TODO

----

*Legend*

.. [1] - *Not yet implemented*


.. External Links

.. _InstructEric: https://instruct-eric.eu/
