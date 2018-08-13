import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class Navigation extends Component{
    state={
        query:''
    }



    setMarker(place) {
        place.populateInfoWindow(place.marker, place.props.largeInfowindow)
    }

    updateQuery = (query) => {
        this.setState({query:query})
    }

    clearQuery = (query) => {
        this.setState({query:''})
    }

    render(){
        const { query } = this.state;
        const { locationMarkers } = this.props;
        const places = locationMarkers;

        let showingPlaces;
        if(query){
            const match = new RegExp(escapeRegExp(this.state.query),'i');
            showingPlaces = places.filter((place) => match.test(place.props.name));
        } else{
            showingPlaces = places;
        }
        showingPlaces.sort(sortBy('name'));

        return(
            <div>
        {this.props.menu&&(
            <div className="list">
                            <div className="list__nav">
                                <h3>Neighbourhood App</h3>
                            </div>
                            <div className="list__content">
                                <input className="list__content-input"
                                       type="text"
                                       placeholder="Search place"
                                       value={query}
                                       onChange={(event) => this.updateQuery(event.target.value)} />
                                {this.state.query&&(
                                    <button onClick={() => this.clearQuery()}><i className="fas fa-times"></i></button>
                                )}
                                {!this.state.query&&(
                                    <button disabled><i className="fas fa-times"></i></button>
                                )}

                                </div>
                            <div className="list__content-list">
                                <ul>
                                    {showingPlaces&&(
                                        showingPlaces.map(location =>(
                                            <li key={location.props.name} onClick={(e) => this.setMarker(location)} >{location.props.name}</li>
                                        ))
                                    )}
                                </ul>
                            </div>
                     </div>
        )}
                </div>
        )
    }
}

export default Navigation;