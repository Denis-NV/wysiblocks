import React, { useState } from "react";
import PropTypes from "prop-types";

import { Map, Marker, InfoWindow, GoogleApiWrapper } from "google-maps-react";

const GoogleMap = props => {
  const { lat, lng, name, zoom = 10 } = props;

  // Hooks
  const [state, setState] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  });

  // Handlers
  const onMarkerClick = (props, marker, e) => {
    setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  const onInfoClose = e => {
    setState({ ...state, showingInfoWindow: false });
  };

  //Render
  if (!props.google) {
    return <div>Loading...</div>;
  }

  return (
    <Map
      google={props.google}
      zoom={zoom}
      initialCenter={{
        lat: lat,
        lng: lng
      }}
      mapTypeControl={false}
    >
      <Marker onClick={onMarkerClick} name={name} />
      <InfoWindow
        onClose={onInfoClose}
        marker={state.activeMarker}
        visible={state.showingInfoWindow}
      >
        <div>
          <p>{state.selectedPlace.name}</p>
        </div>
      </InfoWindow>
    </Map>
  );
};

GoogleMap.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  zoom: PropTypes.number,
  google: PropTypes.object
};

export default GoogleApiWrapper({
  apiKey: window._env_.REACT_APP_GOOGLE_MAPS_API_KEY
})(GoogleMap);
