import React from "react";
import axios from "axios";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid, CircularProgress } from "@material-ui/core";
import GoogleMaps from "./GoogleMaps";
import GoogleMapAutoComplete from "./GoogleMapAutoComplete";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

axios.defaults.withCredentials = true;
const API_KEY = "c3e8793eb809694aee4ce6c2e1bf2551"

const styles = theme => ({
    container: {
        display: 'flex',
        margin: '2em',
        flexDirection: 'column'
    },
    input: {
        marginBottom: '0.75em'
    },
    action: {
        marginTop: '1em',
    },
    title: {
        marginBottom: '1em'
    },
    weatherIcon: {
        zIndex: 100
    },
    text: {
        color: 'white',
        zIndex: 100,
    },
    // autocomplete: {
    //     padding: '10px',
    // },
    cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        color: 'white',
    },
    card: {
        position: 'relative',
        width: '100%',
        minHeight: '175px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        marginBottom: '2em',
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

class TripDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trip: {},
            currentWeather: "",
            currentTemp: "",
            redirect: false,
            loading: false,
            query: '',
            savedPlaces: [],
            isMarkerShown: false,
            createdSuccessfully: false
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this._getTripDetailById(id);
        this._getSavedPlacesByTripId(id)
        this.delayedShowMarker()
    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({ isMarkerShown: true })
        }, 3000)
    }

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false })
        this.delayedShowMarker()
    }

    render() {
        const { classes } = this.props

        if (this.state.loading) {
            return (<CircularProgress />)
        }
        return (
            <div className={classes.container} >
                <Grid container spacing={3} >
                    <Grid item xs={6} sm={6}>
                        <GoogleMapAutoComplete className={classes.autocomplete} type="establishment" label="Search for places to visit" onAutoComplete={this._onAutoComplete}
                            bounded lat={this.state.trip.lat} long={this.state.trip.long} />
                        {this.state.savedPlaces && this.state.savedPlaces.length > 0 && (
                            this.state.savedPlaces.map(result => (
                                <div className="autocomplete-place">
                                    <Card key={result.id} className="weather-container" style={{ backgroundImage: `url('${result.picture_url}')` }}>
                                        <CardContent className={classes.cardContent} >
                                            <Typography gutterBottom variant="h6" component="h2">
                                                {result.name}
                                            </Typography>
                                            <IconButton style={{ color: 'white' }} aria-label="delete" onClick={() => this._handleDelete(result.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Card className={classes.card} style={{
                            backgroundImage: `url('${this.state.trip.picture_url}')`
                        }}>
                            <div className={classes.overlay} />

                            <CardContent className={classes.cardAction}>
                                <img className={classes.weatherIcon} src={this.state.weatherIcon} />
                                <Typography className={classes.text} variant="h5" align="left">{this.state.trip.location}</Typography>
                                <Typography className={classes.text} variant="subtitle1" align="left">{this.state.currentTemp}˚F {this.state.currentWeather}</Typography>
                            </CardContent>

                            <Typography gutterBottom variant="h6" component="h2" align="left" >
                            </Typography>
                        </Card>
                        <GoogleMaps
                            isMarkerShown={this.state.isMarkerShown}
                            onMarkerClick={this.handleMarkerClick}
                            lat={parseFloat(this.state.trip.lat)}
                            long={parseFloat(this.state.trip.long)}
                        />
                    </Grid>
                </Grid>

            </div >
        );
    }

    _handleQuery = e => {
        this.setState({ query: e.target.value })
    }

    _onAutoComplete = (data) => {
        const latitude = data.lat
        const longitude = data.long
        const name = data.location
        const pictureUrl = data.pictureUrl
        const type = 'default'
        const tripId = this.state.trip.id

        const createBody = { latitude, longitude, name, type, pictureUrl, tripId }

        this.savePlace(createBody);
    }

    savePlace = (createBody) => {
        axios
            .post("/api/create/places", createBody)
            .then(response => {
                console.log(response)
                console.log("place sucess!");
                const newSavedPlaces = this.state.savedPlaces
                newSavedPlaces.push({
                    ...createBody, id: response.data.newPlaceId
                })

                this.setState({ savedPlaces: newSavedPlaces });
                const id = this.props.match.params.id;
                this._getSavedPlacesByTripId(id)
            })
            .catch(e => {
                console.log("place failed");
                this.setState({ loading: false });
            });
    }

    _handleDelete = (id) => {
        axios.delete(`/api/saved-places/${id}`).then(response => {
            const newSavedPlaces = this.state.savedPlaces.filter(savedPlace => savedPlace.id !== id)

            this.setState({ savedPlaces: newSavedPlaces })
        })
            .catch(err => {
                console.log(err);
                console.log("error deleting trip ");
                this.setState({ loading: false });
            });
    }

    _getTripDetailById = id => {
        this.setState({ loading: true });
        axios
            .get(`/api/trip-detail/${id}`)
            .then(response => {
                console.log(response.data.result);

                this.setState({
                    trip: response.data.result,
                    loading: false
                });
                this._getTripWeather();
            })
            .catch(err => {
                console.log(err);
                console.log("no event");
                this.setState({ loading: false });
            });
    };
    _getSavedPlacesByTripId = tripId => {
        this.setState({ loading: true });

        axios
            .get(`/api/saved-places-detail/${tripId}`)
            .then(response => {

                this.setState({
                    savedPlaces: response.data.result,
                    loading: false
                });
            })
            .catch(err => {
                console.log(err);
                console.log("no event");
                this.setState({ loading: false });
            });
    };

    _getTripWeather = () => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.trip.location}&appid=${API_KEY}`,
            { withCredentials: false }
        )
            .then(response => {
                console.log(response.data.weather[0].description);
                const tempInFahrenheit = Math.round((response.data.main.temp - 273.15) * 9 / 5 + 32)
                this.setState({
                    currentWeather: response.data.weather[0].description,
                    weatherIcon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
                    currentTemp: tempInFahrenheit
                })
            })
            .catch(err => {
                console.log(err);
                console.log("no event");
            });
    }
}

export default withStyles(styles)(TripDetail);
