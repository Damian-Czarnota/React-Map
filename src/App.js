import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css';
import Navigation from './navigation';
import MapContainer from './MapContainer';
import * as config from './mapConfig'

//Handling when  Google's API have any Problem on the request
document.addEventListener("DOMContentLoaded", function(e) {
    let scriptTag = document.getElementsByTagName('SCRIPT').item(1);
    scriptTag.onerror = function(e) {
        let errorContainer = document.querySelector('#root');
        let errorContent = document.createElement('div');
        errorContent.innerHTML = `<div class="main__error">There is problem with Google's API <i class='fas fa-frown'></i> </div>`
        errorContainer.appendChild(errorContent)
    }
})

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationMarkers: [],
            menu:true,
            classMenu:'main__map',
            places:''
        }
        this.markers = [];
        this.addMarker = this.addMarker.bind(this);
        this.setPlaces = this.setPlaces.bind(this);
      }

      componentDidMount(){
        window.gm_authFailure = this.gm_authFailure;
    }

    addMarker(marker) {
        this.markers.push(marker);

        if(this.markers.length === config.locations.length) {
            this.setState({locationMarkers: this.markers})
        }
    }

    setPlaces(places){
        this.setState({places:places})
    }

    gm_authFailure(){
        window.alert("There is problem with Google's API")
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
                    setPlaces={this.setPlaces}
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
                    places={this.state.places}
                />
            </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyC03CZuek6R5OxDK_uC3pAvny-GiqXZ3aY'
})(App)
