import React from "react";
import Axios from "axios";

// TODO: Change this endpoint if it's different from what you created
const loginApiEndpoint = "http://localhost:3001/login";

export default class LoginForm extends React.Component {
    state = {
        email: "",
        password: "",
        loading: false,
        loginSuccess: false,
    };

    onEmailInputChange = event => {
        this.setState({ email: event.target.value });
    };

    onEmailInputChange = event => {
        this.setState({ password: event.target.value });
    };

    onSubmit = () => {
        const loginBody = {
            email: this.state.email,
            password: this.state.password
        }

        this.setState({ loading = true })
        Axios.post(loginApiEndpoint, loginBody).then(response => {
            console.log("logged in successfully!")

            this.setState({ loginSuccess = true, loading = false })
        }).catch(e => {

            this.setState({ loading = false })
        });
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.state.loading && <h1>Logging you in, please wait</h1>}
                <input
                    type="text"
                    value={this.state.email}
                    onChange={this.onEmailInputChange}
                />
                <input
                    type="password"
                    value={this.state.password}
                    onChange={this.onPasswordChange}
                />

                <button type="submit" disabled={this.state.loading}>Login</button>
            </form>
        );
    }
}