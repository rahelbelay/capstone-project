import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import history from "./history";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles, Typography, Paper } from "@material-ui/core";
import GoogleMapAutoComplete from "./GoogleMapAutoComplete";

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
                <Typography className={classes.title} variant="h4">Live with no excuses and <br></br>travel with no regret</Typography>
                <div className="login-wrapper">
                    <form noValidate autoComplete="off" onSubmit={this.onSubmit}>
                        <Paper className="paper">
                            <GoogleMapAutoComplete label="Where would you like to go?" type="geocode" onAutoComplete={this.onAutoComplete} />

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

    onAutoComplete = data => {
        const lat = data.lat
        const long = data.long
        const location = data.location
        const pictureUrl = data.pictureUrl

        this.setState({ lat, long, location, pictureUrl })
    }

    onSubmit = e => {
        e.preventDefault();

        const createBody = {
            location: this.state.location,
            lat: this.state.lat,
            long: this.state.long,
            day: this.state.day,
            pictureUrl: this.state.pictureUrl
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
