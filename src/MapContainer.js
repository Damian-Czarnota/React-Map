import React, { Component } from 'react';
import Map from './map'


export default class MapContainer extends Component {

    render() {
        const { google,addMarker,places } = this.props;

        return (
                <main role="application"  aria-label="Map showing places">
                    <Map
                        google={google}
                        addMarker={addMarker}
                        places={places}
                    />
                </main>
        )
    }
}