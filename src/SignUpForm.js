import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Paper, Typography, withStyles } from "@material-ui/core";

axios.defaults.withCredentials = true;

const styles = theme => ({
    input: {
        marginBottom: '0.75em'
    },
    action: {
        marginTop: '1em',
    },
    title: {
        marginBottom: '1em'
    }
});

class SignUpForm extends React.Component {
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
        const { classes } = this.props;

        if (this.state.signUpSuccess) {
            return <Redirect to="/api/login" />
        }
        return (
            <div className="login-wrapper">
                <form noValidate autoComplete="off" onSubmit={this.onSubmit}>
                    <Paper className="paper">
                        <Typography className={classes.title} variant="h6">Create an account</Typography>
                        <TextField
                            label="Email"
                            variant="filled"
                            fullWidth
                            onChange={this._handleEmail}
                            value={this.state.email}
                            className={classes.input}
                        />

                        <TextField
                            type="password"
                            label="Password"
                            variant="filled"
                            fullWidth
                            onChange={this._handlePassword}
                            value={this.state.password}
                            className={classes.input}
                        />

                        <TextField
                            label="First Name"
                            variant="filled"
                            fullWidth
                            onChange={this._handleFirstName}
                            value={this.state.first_name}
                            className={classes.input}
                        />

                        <TextField
                            label="Last Name"
                            variant="filled"
                            fullWidth
                            onChange={this._handleLastName}
                            value={this.state.last_name}
                            className={classes.input}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            className={classes.action}
                            variant="contained"
                            color="primary"
                        >
                            Sign up
                        </Button>
                    </Paper>
                </form>
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

export default withStyles(styles)(SignUpForm)
