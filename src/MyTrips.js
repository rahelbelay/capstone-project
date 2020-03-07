import React from "react";
import axios from "axios";
import history from "./history";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Redirect } from "react-router-dom";

axios.defaults.withCredentials = true;

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
        if (!this.state.trips || this.state.trips.length === 0) {
            return (
                <div>
                    <Typography variant="h6">You don't have any trips, why don't you create one</Typography>
                    <Button variant="contained" href="/api/create-trip">Create Trip</Button>
                </div>
            )
        }

        return (
            <div>
                {this.state.loading && <h1>loading...</h1>}
                <div className="card-container">
                    {this.state.trips && this.state.trips.map(trip =>
                        <Card className="trip-card">
                            <CardActionArea onClick={() => this._handleClick(trip.id)} >
                                <CardMedia
                                    image="/static/images/cards/contemplative-reptile.jpg"
                                    title="Contemplative Reptile"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Image of Places
                                    </Typography>
                                </CardContent>
                                <Typography gutterBottom variant="subtitle1" align="center">
                                    {`Your trip to ${trip.location}`}
                                </Typography>
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

export default MyTrips;
