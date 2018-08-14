import React, { Component } from 'react';
import * as config from './mapConfig';
import Marker from './Marker'

class Map extends Component {

    componentDidMount() {
        this.loadMap();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
    }

    loadMap() {
        const mapContainer = document.querySelector("#map");
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

            //setup the Map
            const mapObj = Object.assign({}, {
                center: config.center,
                zoom: config.map.zoom,
                styles: config.map.styles,
                mapTypeControl: config.map.mapTypeControl

            })

            //inst. the map
            this.map = new maps.Map(mapContainer, mapObj);
            //unique instance of Bounds
            this.bounds = new google.maps.LatLngBounds();
            //unique instance of infoWindow
            this.largeInfowindow = new google.maps.InfoWindow();

            //force the update here to get this.map filled
            this.forceUpdate();
        } else {
            mapContainer.innerHTML = `<div class="main__error">There is problem with Google's API <i class='fas fa-frown'></i> </div>`
        }
    }

    render() {
        const style = {
            width: '100%',
            height: '100vh'
        }
        const { addMarker,places } = this.props;
        let locations=[];
        if(places===''){
            locations = config.locations;
        }
        else{
            let tempLocations = config.locations;
            for(let location of tempLocations){
                let ok = false;
                for(let locationS of places){
                    if(location.name===locationS.props.name) {
                        ok = true;
                        location.marker = locationS;
                    }
                }
                if(!ok) {
                    location.marker.marker.setMap(null);
                }
                else{
                    location.marker.marker.setMap(this.map);
                }
            }
        }
        return (
            <div id='map' style={style} >
                Loading map...
                {locations.map( (location, index) => (
                    <Marker   key={index}
                              google={this.props.google}
                              map={this.map}
                              name={location.name}
                              address={location.address}
                              website={location.website}
                              position={location.location}
                              bounds={this.bounds}
                              largeInfowindow={this.largeInfowindow}
                              addMarker={addMarker}
                    />
                ))}
            </div>
        )
    }
}

export default Map;