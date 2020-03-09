import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const API_KEY = 'AIzaSyD_EXdqLdaexVtGyv3bE3B48-FdiBmgtBg'

const GoogleMaps = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: props.lat, lng: props.long }}
    >
        {props.isMarkerShown && <Marker position={{ lat: props.lat, lng: props.long }} onClick={props.onMarkerClick} />}
    </GoogleMap>
)

export default GoogleMaps
