import React from 'react';
import axios from 'axios';
import {
    Redirect
} from "react-router-dom";
axios.defaults.withCredentials = true

class MyTrips extends React.Component {




    constructor(props) {
        super(props)
        this.state = {
            trips: [],
            createdSuccessfully: false
        };
    }

    componentDidMount() {
        this._getAllTripsByUserId()
    }
    render() {

        return (
            <div>
                {this.state.loading && <h1>loading...</h1>}
                <ul>

                    {this.state.trips.map(trip => {
                        return <li>
                            {
                                <div>

                                    < div className="my-trips">

                                        <button onClick={() => this._handleClick(trip.id)}> {` Your trip to ${trip.location}`}</button>

                                        {/* <p>{trip.day}</p> */}
                                    </div>
                                    {/* {this.state.createdSuccessfully && <Redirect to="/api/trip-detail/:id" />} */}
                                </div>
                            }
                        </li>
                    })}
                </ul>
            </div >
        );
    }

    componentDidUpdate() {
        if (this.state.createdSuccessfully) {
            this.setState({
                loading: false,
                createdSuccessfully: false
            })

            // history.push('/my-trips');
            // history.push('/my-trips')
        }
    }
    _handleClick = (tripId) => {
        console.log(tripId)
    }
    _getAllTripsByUserId = async () => {
        this.setState({ loading: true })
        await axios.get("/api/my-trips")
            .then(response => {
                console.log(response.data.result)
                this.setState({
                    trips: response.data.result,
                    loading: false
                })
                console.log(this.state.trips)

            })
            .catch(err => {
                console.log(err)
                console.log('no event')
                this.setState({ loading: false })
            })
    }
}

export default MyTrips;