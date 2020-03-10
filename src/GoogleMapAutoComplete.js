import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

const API_KEY = 'AIzaSyD_EXdqLdaexVtGyv3bE3B48-FdiBmgtBg'

function loadScript(src, position, id) {
    if (!position) {
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };
let placesService = null;

const useStyles = makeStyles(theme => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
}));

export default function GoogleMapAutoComplete(props) {
    const classes = useStyles();
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const loaded = React.useRef(false);

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry,drawing,places`,
                document.querySelector('head'),
                'google-maps',
            );
        }

        loaded.current = true;
    }

    const handleChange = event => {
        setInputValue(event.target.value);
    };

    const onAutoComplete = placeId => {
        const request = {
            placeId,
            fields: ['name', 'photo', 'formatted_address', 'place_id', 'geometry']
        };

        placesService.getDetails(request, placesLookupCallback)
    }

    const placesLookupCallback = (place, status) => {
        const lat = place.geometry.location.lat()
        const long = place.geometry.location.lng()
        const location = place.name
        const pictureUrl = place.photos && place.photos[0] ? place.photos[0].getUrl() : ''

        const data = { lat, long, location, pictureUrl }

        props.onAutoComplete(data)

    }

    const fetch = React.useMemo(
        () =>
            throttle((request, callback) => {
                autocompleteService.current.getPlacePredictions(request, callback);
            }, 200),
        [],
    );

    React.useEffect(() => {
        let active = true;

        if (!autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }

        if (window.google) {
            placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
        }

        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === '') {
            setOptions([]);
            return undefined;
        }

        const query = { input: inputValue, types: [props.type] }

        if (props.bounded) {
            query.location = new window.google.maps.LatLng(props.lat, props.long)
            query.radius = 1000
        }

        fetch(query, results => {
            if (active) {
                setOptions(results || []);
            }
        });

        return () => {
            active = false;
        };
    }, [inputValue, fetch]);

    return (
        <Autocomplete
            style={{ width: 300 }}
            getOptionLabel={option => (typeof option === 'string' ? option : option.description)}
            options={options}
            autoComplete
            includeInputInList
            onChange={(event, value) => {
                if (value && value.place_id) {
                    onAutoComplete(value.place_id)
                }
            }}
            disableOpenOnFocus
            renderInput={params => (
                <TextField
                    {...params}
                    label={props.label}
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                />
            )}
            renderOption={option => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map(match => [match.offset, match.offset + match.length]),
                );

                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <LocationOnIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs>
                            {parts.map((part, index) => (
                                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                    {part.text}
                                </span>
                            ))}

                            <Typography variant="body2" color="textSecondary">
                                {option.structured_formatting.secondary_text}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
}
