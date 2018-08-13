import React, { Component } from 'react';
import Map from './map'


export default class MapContainer extends Component {

    render() {
        const { google,addMarker } = this.props;

        return (
                <main role="presentation"  aria-label="Map showing places">
                    <Map
                        google={google}
                        addMarker={addMarker}
                    />
                </main>
        )
    }
}