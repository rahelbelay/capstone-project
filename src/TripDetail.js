import React from "react";
import axios from "axios";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid, TextField } from "@material-ui/core";

axios.defaults.withCredentials = true;
const API_KEY = "c3e8793eb809694aee4ce6c2e1bf2551"
const ApI_KEY_GOOGLE = "AIzaSyD_EXdqLdaexVtGyv3bE3B48-FdiBmgtBg"

const styles = theme => ({
    container: {
        display: 'flex',
        width: '100%',
        marginTop: '2em'
    },
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
            results: []
        };
    }

    componentDidMount() {
        console.log(this.props)
        const id = this.props.match.params.id;
        this._getTripDetailById(id);
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.container}>
                <Grid container spacing={3} direction="column">
                    <Grid item xs={12}>
                        <TextField
                            label={`Search for places in ${this.state.trip.location}`}
                            variant="filled"
                            fullWidth
                            onChange={this._handleQuery}
                            value={this.state.query}
                            className={classes.input}
                        />
                        <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            fullWidth
                            className={classes.action}
                            disabled={this.state.loading}
                            onClick={this._handleSearch}>
                            Search
                        </Button>

                        {this.state.results && this.state.results.length > 0 && (
                            this.state.results.map(result => (
                                <Card key={result.id} className={classes}>
                                    <CardMedia
                                        image={result.image}
                                        title={result.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {result.name}
                                        </Typography>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {result.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        )}

                    </Grid>
                    <Grid item xs={12}>
                        <Card className={classes}>
                            {this.state.loading && <h1>loading...</h1>}
                            <CardMedia
                                image="/static/images/cards/contemplative-reptile.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <p>Current temprature is {this.state.currentTemp} Fahrenheit with {this.state.currentWeather}</p>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div >
        );
    }

    _handleQuery = e => {
        this.setState({ query: e.target.value })
    }

    _handleSearch = async () => {
        const googleSearchResults = []
        // call to google maps api and save it to state
        // send this.state.query to google maps api 
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=${ApI_KEY_GOOGLE}&input=pizza+near%20paris`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } }
        ).then(response => {
            console.log(response)
        });



        googleSearchResults.push({ name: response.data.predictions[0].value, description: 'test test test', image: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png' })

        this.setState({ results: googleSearchResults, loading: false })
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

    _getTripWeather = () => {

        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.trip.location}&appid=${API_KEY}`,
            { withCredentials: false }
        )
            .then(response => {
                console.log(response.data.weather[0].description);
                const tempInFahrenheit = Math.round((response.data.main.temp - 273.15) * 9 / 5 + 32)
                this.setState({
                    currentWeather: response.data.weather[0].description,
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