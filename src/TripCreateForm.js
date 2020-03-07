import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import history from "./history";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles, Typography, Paper } from "@material-ui/core";

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


class TripCreateForm extends React.Component {
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
        const { classes } = this.props;

        if (this.state.createdSuccessfully) {
            return <Redirect to="/api/my-trips" />
        }

        return (
            <div>
                <Typography className={classes.title} variant="h6">Live with no excuses and travel with no regret</Typography>
                <div className="login-wrapper">
                    <form noValidate autoComplete="off" onSubmit={this.onSubmit}>
                        <Paper className="paper">
                            <TextField
                                label="Enter City"
                                fullWidth
                                className={classes.input}
                                variant="filled"
                                onChange={this._handleLocation}
                                value={this.state.location}
                            />

                            <TextField
                                label="How many days ..."
                                fullWidth
                                className={classes.input}
                                variant="filled"
                                onChange={this._handleDay}
                                value={this.state.day}
                            />

                            <Button
                                type="submit"
                                className={classes.action}
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Create Trip
                        </Button>
                        </Paper>
                    </form>
                </div >
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

export default withStyles(styles)(TripCreateForm)
