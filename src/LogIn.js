import React from "react";
import axios from "axios";
import history from "./history";
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

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loading: false,
            loginSuccess: false
        };
    }
    render() {
        const { classes } = this.props;

        if (this.state.loginSuccess) {
            return <Redirect to="/api/my-trips" />
        }

        return (
            <div className="login-wrapper">
                <form noValidate autoComplete="off" onSubmit={this.onSubmit}>
                    <Paper className="paper">
                        <Typography className={classes.title} variant="h6">Login to your account</Typography>
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
                        <Button
                            type="submit"
                            variant="contained"
                            size="medium"
                            color="primary"
                            fullWidth
                            className={classes.action}
                            disabled={this.state.loading}>
                            Sign In
                    </Button>
                    </Paper>
                </form>
            </div>
        );
    }
    onSubmit = (e) => {
        e.preventDefault();

        const loginBody = {
            email: this.state.email,
            password: this.state.password
        };

        this.setState({ loading: true });
        axios
            .post("/api/login", loginBody)
            .then(response => {
                this.setState({ loginSuccess: true, loading: false });
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
}

export default withStyles(styles)(LoginForm)
