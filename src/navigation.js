import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class Navigation extends Component{
    constructor(props){
        super(props);
        this.state={
            query:''
        }
        this.showingPlaces=[];
        this.updateQuery = this.updateQuery.bind(this);
    }




    setMarker(place) {
        place.populateInfoWindow(place.marker, place.props.largeInfowindow)
    }

    updateQuery = (query) => {
        const { locationMarkers,setPlaces } = this.props;
        this.setState({query:query})
        const places = locationMarkers;

        if(query){
            const match = new RegExp(escapeRegExp(this.state.query),'i');
            this.showingPlaces = places.filter((place) => match.test(place.props.name));
        } else{
            this.showingPlaces = places;
        }
        this.showingPlaces.sort(sortBy('name'));
        setPlaces(this.showingPlaces);
    }

    clearQuery = (query) => {
        const { locationMarkers,setPlaces } = this.props;
        this.setState({query:''})
        setPlaces(locationMarkers);
    }

    render(){
        const { query } = this.state;
        const { locationMarkers } = this.props;

        if(query===''){
            this.showingPlaces=locationMarkers;
        }

        return(
            <div>
        {this.props.menu&&(
            <div className="list">
                            <div className="list__nav">
                                <h3>Neighbourhood App</h3>
                            </div>
                            <div className="list__content">
                            <label style={{fontWeight:500}} htmlFor="searchInput">Type restaurant</label>
                                <input name="searchInput"
                                className="list__content-input"
                                       type="text"
                                       placeholder="Search place"
                                       value={query}
                                       onChange={(event) => this.updateQuery(event.target.value)} />
                                {this.state.query&&(
                                    <button name="Clear query button" onClick={() => this.clearQuery()}><i className="fas fa-times"></i></button>
                                )}
                                {!this.state.query&&(
                                    <button disabled><i className="fas fa-times"></i></button>
                                )}

                                </div>
                            <div className="list__content-list">
                                <ul>
                                    {this.showingPlaces&&(
                                        this.showingPlaces.map(location =>(
                                            <li key={location.props.name} onClick={(e) => this.setMarker(location)}><button name={location.props.name}>{location.props.name}</button></li>
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