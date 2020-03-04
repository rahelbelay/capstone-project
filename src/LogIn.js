import React from 'react';
import axios from "axios";
axios.defaults.withCredentials = true


export default class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
            loginSuccess: false,

        };
    }
    render() {

        return (
            <div >
                <div >
                    <input type="text" placeholder="Search for places" />
                    <form onSubmit={this.onSubmit} >

                        <input
                            onChange={this._handleEmail}
                            value={this.state.email} placeholder="E-Mail"
                        />
                        <input type="password"
                            onChange={this._handlePassword}
                            value={this.state.password} placeholder="Password"
                        />
                        <input type="submit" value="Sign in" disabled={this.state.loading} />
                    </form>
                </div>

            </div>
        )
    }
    onSubmit = () => {
        const loginBody = {
            email: this.state.email,
            password: this.state.password
        }
        this.setState({ loading: true })
        axios.post('/api/login', loginBody).then(response => {
            console.log("logged in successfully!")
            this.setState({ loginSuccess: true, loading: false })
        }).catch(e => {

            this.setState({ loading: false })
        });
    };


    _handleEmail = (event) => {
        this.setState({
            email: event.target.value
        });
    }
    _handlePassword = (event) => {
        this.setState({
            password: event.target.value
        });
    }
}

