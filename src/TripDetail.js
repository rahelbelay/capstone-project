import React from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';


axios.defaults.withCredentials = true;

class TripDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trips: [],
            redirect: false,
            loading: true
        };
    }

    componentDidMount() {
        console.log(this.props)
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
                                            <p>weather</p>
                                            <p>busy???</p>
                                            <p>{trip.day}</p>
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
                    trips: [...this.state.trips, response.data.result],
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

export default TripDetail;