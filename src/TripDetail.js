import React from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

class MyTrips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trips: [],
            redirect: false,
            loading: true
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this._getTripDetailById(id);
    }

    render() {
        return (
            <div>
                {this.state.loading && <h1>loading...</h1>}
                <ul>
                    {this.state.trips.map(trip => {
                        return (
                            <li>
                                {
                                    <div>
                                        <div className="trip-detail">
                                            <p>{trip.location}</p>
                                            {/* <p>weather</p>
                                                <p>busy???</p> */}
                                            {/* <p>{trip.day}</p> */}
                                        </div>
                                    </div>
                                }
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    _getTripDetailById = id => {
        this.setState({ loading: true });
        axios
            .get(`/api/trip-detail/${id}`)
            .then(response => {
                console.log(response.data.result);
                this.setState({
                    trips: response.data.result,
                    loading: false
                });
                console.log(this.state.trips);
            })
            .catch(err => {
                console.log(err);
                console.log("no event");
                this.setState({ loading: false });
            });
    };
}

export default MyTrips;