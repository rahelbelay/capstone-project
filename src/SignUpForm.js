import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
axios.defaults.withCredentials = true;

export default class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            signUpSuccess: false
        };
    }

    render() {
        if (this.state.signUpSuccess) {
            return <Redirect to="/api/login" />
        }

        return (
            <div>
                <div>
                    <form onSubmit={this.onSubmit}>
                        <input
                            onChange={this._handleEmail}
                            value={this.state.email}
                            placeholder="E-Mail"
                        />
                        <input
                            type="text"
                            onChange={this._handlePassword}
                            value={this.state.password}
                            placeholder="password "
                        />
                        <input
                            onChange={this._handleFirstName}
                            value={this.state.first_name}
                            placeholder="First Name"
                        />
                        <input
                            onChange={this._handleLastName}
                            value={this.state.last_name}
                            placeholder="Last Name"
                        />
                        <input type="submit" value="Sign Up" />
                    </form>
                </div>
            </div>
        );
    }

    onSubmit = (e) => {
        e.preventDefault();

        const signupBody = {
            email: this.state.email,
            password: this.state.password,
            first_name: this.state.first_name,
            last_name: this.state.last_name,

        };

        this.setState({ loading: true });
        axios
            .post("/api/signup", signupBody)
            .then(response => {
                console.log("logged in successfully!");

                this.setState({ signUpSuccess: true, loading: false });
            })
            .catch(e => {
                this.setState({ loading: false });
            });
    };

    _handleEmail = event => {
        this.setState({
            email: event.target.value
        });
    };

    _handlePassword = event => {
        this.setState({
            password: event.target.value
        });
    };

    _handleFirstName = event => {
        this.setState({
            first_name: event.target.value
        });
    };

    _handleLastName = event => {
        this.setState({
            last_name: event.target.value
        });
    };
}