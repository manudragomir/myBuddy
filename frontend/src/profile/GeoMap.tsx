import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { mapsApiKey } from './mapsApiKey';



interface MyMapProps {
  lat?: number;
  lng?: number;
  onMapClick: (e: any) => void,
  onMarkerClick: (e: any) => void,
}


export const MyMap =
  compose<MyMapProps, any>(
    withProps({
      googleMapURL:
        `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&v=3.exp&libraries=geometry,drawing,places`,
      loadingElement: <div style={{ height: `400px` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `400px` }} />
    }),
    withScriptjs,
    withGoogleMap
  )(props => (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: props.lat, lng: props.lng }}
      onClick={props.onMapClick}
    >
      <Marker
        position={{ lat: props.lat, lng: props.lng }}
        onClick={props.onMarkerClick}
        draggable={true}
      >
          <InfoWindow
            >
              <div>
                <p>Move this then click on it for changing the location!</p>
              </div>
          </InfoWindow>
      </Marker>
    </GoogleMap>
  ))
