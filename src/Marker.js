import { Component } from 'react';
import PropTypes from 'prop-types'
import * as config from './mapConfig';

class Marker extends Component {

    state = {
        client: {
        id: 'VVPEFJC40SJDVH1YFRJS4IBNQ0GGZJY5X1XLHEA23H1LTVOQ',
        secret: 'MEAM2N42L434P1MB1AJZFUHM5XAGMCDNGETUH5XNZIYEHOKI'
        }
}
    componentDidUpdate(prevProps) {
        if ((this.props.map !== prevProps.map) ||
            (this.props.position !== prevProps.position)) {
            this.renderMarker();
        }
    }
    renderMarker() {
        if (this.marker) {
            this.marker.setMap(null);
        }

        let { map, google, position, bounds, largeInfowindow,addMarker } = this.props;
        let defaultIcon = this.markerIcon();
        position = new google.maps.LatLng(position.lat, position.lng);

        const markerConfig = {
            map: map,
            animation: google.maps.Animation.DROP,
            draggable:false,
            position: position,
            icon: defaultIcon
        };
        this.marker = new google.maps.Marker(markerConfig);
        const marker = this.marker;

        // Create an onclick event to open the large infowindow at each marker.
        let self = this;
        marker.addListener('click', function() {
            self.populateInfoWindow(this, largeInfowindow);
        });

        addMarker(this);

        bounds.extend(marker.position);
        map.fitBounds(bounds);

    }


    populateInfoWindow(marker, infowindow) {
        let { client } = this.state;
        let { map, google, bounds, name, address, website } = this.props;

        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker !== marker) {
            //set some Animation when MArker has cliked
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 700);

            infowindow.setContent('Loading...');
            let venueID = null;
            let tips = null;
            let photos = null;
            fetch(`https://api.foursquare.com/v2/venues/search?ll=${config.center.lat},${config.center.lng}&v=20130815&query=${name}&limit=1&client_id=${client.id}&client_secret=${client.secret}`)
                .then(response => response.json())
                .then(data => {
                    venueID = data.response.venues[0].id;
                    return fetch(`https://api.foursquare.com/v2/venues/${venueID}/tips?v=20130815&limit=4&client_id=${client.id}&client_secret=${client.secret}`);
                })
                .then(response => response.json())
                .then(data => {
                    tips = data;
                    return fetch(`https://api.foursquare.com/v2/venues/${venueID}/photos?v=20130815&limit=2&client_id=${client.id}&client_secret=${client.secret}`);
                })
                .then(response => response.json())
                .then(data => {
                    photos = data;
                    return fetch(`https://api.foursquare.com/v2/venues/${venueID}/similar?v=20130815&limit=2&client_id=${client.id}&client_secret=${client.secret}`);
                })
                .then(response => response.json())
                .then(data =>  createWindow(tips, photos,data))
                .catch(err => requestError(err, 'Foursquare'));

            //if sucess in Request
            function createWindow(tips, photos,similar) {
                let description = '';

                if (tips && tips.response.tips.items) {
                    const tipsData = tips.response.tips.items;
                    const photosData = photos.response.photos.items;
                    const similarData = similar.response.similarVenues.items;

                    description = `<div id="marker__body"><h1>${name}</h1>
                    <p><span>${address}&nbsp;|&nbsp;<a href="${website}">${website}</a></span></p>
                    <h2>Photos</h2>`
                    for(let photo of photosData) {
                        description += `<img alt="${name}" style="padding:5px;" src="${photo.prefix}64x64${photo.suffix}" />`;
                    }
                    description += '<h2>Tips </h2> <ul id="tips__list">';
                    tipsData.forEach( tip => {
                        description += `<li>${tip.text} ~<em>${tip.user.firstName}</em></li>`;
                    })
                    description += '</ul><h2>Similar Places</h2>';
                    similarData.forEach( similar => {
                        description += `<div><p style="margin:0;padding:0;">${similar.name}</p><p style="margin:0;padding:0;">${similar.location.formattedAddress}</p></div>`;
                    })
                    description += `<p><em><small>Informations from <img src="../img/foursquare.png" style="height:16px" /></small></em></p> </div>`;
                } else {
                    description = `<p>There is no TIP's <i class="fas fa-frown"></i></p>`;
                }
                infowindow.setContent(description);
            }
            //if Error in Request
            function requestError(err, part) {
                console.log(err);
                infowindow.setContent(`<p>Oh no! There was an error making a request for the ${part}.</p>`);
            }
            infowindow.marker = marker;

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });

            infowindow.open(map, marker);
            map.fitBounds(bounds);
            map.panTo(marker.getPosition());
        }
    }

    markerIcon() {
        var image = {
            url: 'https://png.icons8.com/plasticine/64/000000/coffee-to-go.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new this.props.google.maps.Size(64, 64),
            // The origin for this image is (0, 0).
            origin: new this.props.google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new this.props.google.maps.Point(0, 32)
        };
        return image;
    }

    render(){
        return null;
    }
}

export default Marker;

Marker.propTypes = {
    map: PropTypes.object
}