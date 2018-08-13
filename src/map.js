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
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;

            const divMapElement = document.querySelector("#map");

            //setup the Map
            const mapObj = Object.assign({}, {
                center: config.center,
                zoom: config.map.zoom,
                styles: config.map.styles,
                mapTypeControl: config.map.mapTypeControl

            })

            //inst. the map
            this.map = new maps.Map(divMapElement, mapObj);
            //unique instance of Bounds
            this.bounds = new google.maps.LatLngBounds();
            //unique instance of infoWindow
            this.largeInfowindow = new google.maps.InfoWindow();

            //resize the map
            checkSizeWindow(window);
            maps.event.addDomListener(window, 'resize', function(e) {
                checkSizeWindow(e.currentTarget)
            });

            function checkSizeWindow(objWindow){
                if(objWindow.innerWidth < 475) {
                    divMapElement.style.height = 'calc(100vh - 89px)';
                } else {
                    divMapElement.style.height = '91vh';
                }
            }

            //force the update here to get this.map filled
            this.forceUpdate();
        } else {
            console.log('Ops! We cant access Google Maps API for now!')
            let mapContainerElemt = document.querySelector('#map');
            mapContainerElemt.innerHTML = '<div class="error-msg">Ops! We cant access Google Maps API for now! </div>'
        }
    }

    render() {
        const style = {
            width: '100%',
            height: '100vh'
        }

        const { addMarker } = this.props;

        return (
            <div id='map' style={style} >
                Loading map...
                {config.locations.map( (location, index) => (
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