import React from "react";
import axios from "axios";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core";

axios.defaults.withCredentials = true;

const styles = theme => ({
    text: {
        color: 'white',
    },
    card: {
        position: 'relative',
        width: '320px',
        minHeight: '175px',
        margin: '10px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    },
    cardAction: {
        display: 'flex',
        alignItems: 'flex-start',
        height: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'column',
    },
    overlay: {
        height: '100%',
        minHeight: '1px',
        width: '100%',
        position: 'absolute',
        backgroundColor: '#00000075',
    }
});

class MyTrips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trips: [],
            loading: false
        };
    }

    componentDidMount() {
        this._getAllTripsByUserId();
    }

    render() {
        const { classes } = this.props;
        if (!this.state.trips || this.state.trips.length === 0) {
            return (
                <div className="crate-trip">
                    <div >

                        <Typography variant="h4">You don't have any trips, why don't you create one</Typography>
                    </div>
                    <div className="create-button">

                        <Button variant="contained" href="/api/create-trip">Create Trip</Button>
                    </div>
                </div>
            )
        }

        return (
            <div>
                {this.state.loading && <h1>loading...</h1>}
                <div className="card-container">
                    {this.state.trips && this.state.trips.map(trip =>
                        <Card className={classes.card} style={{ backgroundImage: `url('${trip.picture_url}')` }} >
                            <div className={classes.overlay} />
                            <CardActionArea className={classes.cardAction} onClick={() => this._handleClick(trip.id)} >
                                <CardContent>
                                    <Typography className={classes.text} variant="h5" align="left">{trip.location}</Typography>
                                    <Typography className={classes.text} variant="subtitle1" align="left">{`Trip for ${trip.day} days`}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )}
                </div>
            </div>
        );
    }
    _handleClick = tripId => {
        console.log(this.props)
        this.props.history.push(`/api/trip-detail/${tripId}`);
    };

    _getAllTripsByUserId = async () => {
        this.setState({ loading: true });
        await axios
            .get("/api/my-trips")
            .then(response => {
                console.log(response.data.result);
                this.setState({
                    trips: response.data.result,
                    loading: false
                });
                console.log(this.state.trips);
            })
            .catch(err => {
                console.log(err);
                console.log("no event");
                this.setState({ loading: false });
            });
    };
}

export default withStyles(styles)(MyTrips)
