import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import history from "./history";

axios.defaults.withCredentials = true;

export default class TripCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "",
            day: "",
            loading: false,
            createdSuccessfully: false
        };
    }

    componentDidUpdate() {
        if (this.state.createdSuccessfully) {
            this.setState({
                location: "",
                day: "",
                loading: false,
                createdSuccessfully: false
            });

            history.push("/api/my-trips");
        }
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <div>
                    <form onSubmit={this.onSubmit}>
                        <input
                            onChange={this._handleLocation}
                            value={this.state.location}
                            placeholder="Location"
                        />
                        <input
                            onChange={this._handleDay}
                            value={this.state.day}
                            placeholder="Day"
                        />

                        <input type="submit" value="Create Trip" />
                    </form>
                </div>
                {this.state.createdSuccessfully && <Redirect to="/api/my-trips" />}
            </div>
        );
    }

    onSubmit = e => {
        e.preventDefault();
        console.log("submit");
        const createBody = {
            location: this.state.location,
            day: this.state.day
        };

        this.setState({ loading: true });

        axios
            .post("/api/create/trip", createBody)
            .then(response => {
                console.log("trip sucess!");

                this.setState({ createdSuccessfully: true, loading: false });
            })
            .catch(e => {
                console.log("trip failed");
                this.setState({ loading: false });
            });
    };

    _handleLocation = event => {
        this.setState({
            location: event.target.value
        });
    };

    _handleDay = event => {
        this.setState({
            day: event.target.value
        });
    };
}