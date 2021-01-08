import React from "react";
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps';
import {compose, withProps} from 'recompose';
import {mapsApiKey} from '../profile/mapsApiKey';


interface MyMapProps {
    lat?: number;
    lng?: number;
    onMapClick: (e: any) => void,
    onMarkerClick: (e: any) => void,
}


export const PostMap =
    compose<MyMapProps, any>(
        withProps({
            googleMapURL:
                `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&v=3.exp&libraries=geometry,drawing,places`,
            loadingElement: <div style={{height: `43vh`}}/>,
            containerElement: <div style={{height: `43vh`}}/>,
            mapElement: <div style={{height: `43vh`}}/>
        }),
        withScriptjs,
        withGoogleMap
    )(props => (
        <GoogleMap
            defaultZoom={12.5}
            defaultCenter={{lat: props.lat, lng: props.lng}}
            onClick={props.onMapClick}
        >
            <Marker
                position={{lat: props.lat, lng: props.lng}}
                onClick={props.onMarkerClick}
                draggable={false}
            >
            </Marker>
        </GoogleMap>
    ))
