// #######################################
// Events List Block
// #######################################

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { navigateTo, updateBlock } from "../../redux/actions/LocalActions";

// GraphQL
import { EVENT } from "../../queries";
import { EVENT_FEED } from "../../queries";
import { Query } from "@apollo/react-components";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

// Utils
import moment from "moment";
import ReactHtmlParser from "react-html-parser";
import ISO from "../../data/ISO.json";

// Components
import ScrollableItems from "../../.common/ScrollableItems";
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";
import EditableImage from "../../.common/EditableImage";
import GoogleMap from "../../.common/GoogleMap";

const EVENTS_Block = ({
  block_data_set,
  navigateTo,
  updateBlock,
  page_id,
  page_item_id,
}) => {
  // Hooks
  const theme = useTheme();
  const [blocks_data, setData] = useState([]);

  // Render
  const options = block_data_set.options_data;
  const block_id = block_data_set.id;

  return useMemo(() => {
    // Handlers
    const onContentUpdate = (field, value) => {
      const data = { [field]: value };

      updateBlock(page_id, block_id, data);
    };

    if (page_item_id) {
      return (
        <Query query={EVENT} variables={{ uri: page_item_id }}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            const eventItem = data.eventList[0];
            const has_map_data =
              eventItem.lat &&
              eventItem.lat !== 0 &&
              eventItem.lat !== "" &&
              eventItem.lng &&
              eventItem.lng !== 0 &&
              eventItem.lng !== "";

            return (
              <MainContainer theme={theme} settings={{ ...options }}>
                <SingleEventItem theme={theme}>
                  <Typography variant="h4">{eventItem.title}</Typography>
                  <Typography variant="subtitle1" paragraph>
                    {`From `}
                    <strong>
                      {moment(new Date(eventItem.date)).format("MMM Do, HH:mm")}
                    </strong>
                    {` to `}
                    <strong>
                      {moment(new Date(eventItem.closes)).format(
                        "MMM Do, HH:mm"
                      )}
                    </strong>
                  </Typography>
                  {eventItem.image && eventItem.image !== "" && (
                    <Image src={eventItem.image} alt="" theme={theme} />
                  )}

                  <Typography variant="body1" paragraph>
                    {ReactHtmlParser(eventItem.content)}
                  </Typography>
                  <br />
                  <Typography variant="body1">
                    <span>{`Contact: `}</span>
                    <Link href={`mailto:${eventItem.contact_email}`}>
                      {eventItem.contact_name}
                    </Link>
                  </Typography>

                  <Typography variant="body1" paragraph>
                    {`Registration is open from: `}
                    <strong>
                      {moment(new Date(eventItem.registration_date)).format(
                        "MMM Do, HH:mm"
                      )}
                    </strong>
                    {` to `}
                    <strong>
                      {moment(new Date(eventItem.registration_closes)).format(
                        "MMM Do, HH:mm"
                      )}
                    </strong>
                  </Typography>
                  <br />
                  <hr />
                  <Location theme={theme}>
                    <LocationDesc theme={theme} has_map_data={has_map_data}>
                      <Typography variant="h6" paragraph>
                        {eventItem.location}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {
                          ISO.find(
                            (country) =>
                              country["alpha-2"] === eventItem.country
                          ).name
                        }
                      </Typography>
                    </LocationDesc>
                    {has_map_data ? (
                      <LocationMap theme={theme}>
                        <GoogleMap
                          lat={eventItem.lat}
                          lng={eventItem.lng}
                          name={eventItem.location}
                        />
                      </LocationMap>
                    ) : null}
                  </Location>
                </SingleEventItem>
              </MainContainer>
            );
          }}
        </Query>
      );
    } else {
      const onBlocksDataUpdate = (data) => {
        setData([...blocks_data, ...data.eventFeed.nodes]);

        return [data.eventFeed.pageInfo.nextIndex, data.eventFeed.totalCount];
      };

      return (
        <MainContainer theme={theme} settings={{ ...options }}>
          <Header theme={theme}>
            <EditableTextfield
              variant="h4"
              content={options.title}
              updateCallback={(value) => onContentUpdate("title", value)}
            />
            <EditableTextfield
              variant="body1"
              showBlockCtrls
              className="paragraph"
              content={options.body}
              updateCallback={(value) => onContentUpdate("body", value)}
            />
            {options.image_url && options.image_url !== "" && (
              <HeaderImage
                theme={theme}
                page_id={page_id}
                block_id={block_id}
                image_data={{
                  url: ["image_url", options.image_url],
                  //alt: ["image_alt", options.image_alt]
                }}
              />
            )}
          </Header>

          <ScrollableItems
            feed={EVENT_FEED}
            updateCallback={onBlocksDataUpdate}
          >
            {blocks_data.map((block, index) => {
              return (
                <EventItem
                  is_even={index % 2 !== 0}
                  key={block.id}
                  theme={theme}
                >
                  <Typography variant="h5" gutterBottom>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();

                        navigateTo(`${options.events_page_url}/${block.uri}`);
                      }}
                    >
                      {block.title}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="textPrimary" paragraph>
                    {`From `}
                    <strong>
                      {moment(new Date(block.date)).format("MMM Do, HH:mm")}
                    </strong>
                    {` to `}
                    <strong>
                      {moment(new Date(block.closes)).format("MMM Do, HH:mm")}
                    </strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {block.abstract}
                  </Typography>
                </EventItem>
              );
            })}
          </ScrollableItems>
        </MainContainer>
      );
    }
  }, [
    blocks_data,
    page_item_id,
    navigateTo,
    options,
    theme,
    page_id,
    block_id,
    updateBlock,
  ]);
};

EVENTS_Block.propTypes = {
  block_data_set: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateBlock: PropTypes.func.isRequired,
  page_item_id: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {};
};

const mapActionsToProps = { navigateTo, updateBlock };

export default connect(mapStateToProps, mapActionsToProps)(EVENTS_Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)`
  color: ${(p) => p.theme.palette.text.primary};
  display: block;
`;

const Header = styled.div`
  /* padding: 0 ${(p) => p.theme.spacing(2)}px; */
`;

const EventItem = styled.div`
  /* min-height: 100px; */
  padding: ${(p) => p.theme.spacing(2)}px;
  background-color: ${(p) =>
    p.is_even ? p.theme.palette.grey[200] : "inherit"};
`;

const SingleEventItem = styled(EventItem)`
  /* background-color: grey; */
  padding: 0;
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  max-height: 400px;
  margin: ${(p) => p.theme.spacing(2)}px 0;
`;

const HeaderImage = styled(EditableImage)`
  width: 100%;
`;

const Location = styled.div`
  display: flex;

  @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
    flex-direction: column;
  }
`;

const LocationDesc = styled.div`
  min-height: ${(p) => (p.has_map_data ? "250px" : "auto")};
  width: ${(p) => (p.has_map_data ? 50 : 100)}%;
  background-color: ${(p) => p.theme.palette.grey[100]};
  padding: ${(p) => p.theme.spacing(2)}px;

  @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
    width: 100%;
    min-height: auto;
  }
`;
const LocationMap = styled.div`
  position: relative;
  min-height: 250px;
  width: 50%;

  @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
    width: 100%;
  }
`;
