import React from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_KEY = "c3e8793eb809694aee4ce6c2e1bf2551"
class TripDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trip: {},
            currentWeather: "",
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
                    <li>
                        <div>
                            <div className="trip-detail">
                                <p>{this.state.trip.location}</p>
                                <p>{this.state.currentWeather}</p>
                                <p>busy???</p>
                                <p>{this.state.trip.day}</p>
                            </div>
                        </div>
                    </li>
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
                    trip: response.data.result,
                    loading: false
                });
                this._getTripWeather();

            })
            .catch(err => {
                console.log(err);
                console.log("no event");
                this.setState({ loading: false });
            });
    };
    _getTripWeather = () => {

        axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${this.state.trip.location}&appid=${API_KEY}`,
            { withCredentials: false }
        )
            .then(response => {
                console.log(response.data.weather[0].description);
                this.setState({
                    currentWeather: response.data.weather[0].description
                })
                console.log(this.state.currentWeather);

            })
            .catch(err => {
                console.log(err);
                console.log("no event");
            });

    }
}

export default TripDetail;