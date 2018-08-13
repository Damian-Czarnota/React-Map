import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css';
import Navigation from './navigation';
import MapContainer from './MapContainer';
import * as config from './mapConfig'


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationMarkers: [],
            menu:true,
            classMenu:'main__map'
        }
        this.markers = [];
        this.addMarker = this.addMarker.bind(this);
      }

    addMarker(marker) {
        this.markers.push(marker);

        if(this.markers.length === config.locations.length) {
            this.setState({locationMarkers: this.markers})
        }
    }

  render() {
    return (
        <div className="main">
            {this.state.menu&&(
              <div className="main__nav">
                <button className="menu__button" onClick={() => {this.setState({menu:false, classMenu:'main__map-close'})}}><i  className="fas fa-arrow-right"></i> </button>
                <Navigation
                    locationMarkers={this.state.locationMarkers}
                    menu={this.state.menu}
                />
                </div>
            )}
            {!this.state.menu&&(
                <div className="main__nav-close">
                    <button className="menu__button-no-rotate" onClick={() => this.setState({menu:true, classMenu:'main__map'})}><i  className="fas fa-arrow-right"></i> </button>
                </div>
                )}
            <div className={this.state.classMenu}>
                <MapContainer
                    google={this.props.google}
                    addMarker={this.addMarker}
                />
            </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyC03CZuek6R5OxDK_uC3pAvny-GiqXZ3aY'
})(App)
