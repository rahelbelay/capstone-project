import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    link: {
        color: 'white',
    },
}));

export default function NavTabs() {
    const classes = useStyles();

    return (
        <div className={classes.root} className="container">
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <div>
                        <Button className={classes.link} href="/api/create-trip">Create Trip</Button>
                        <Button className={classes.link} href="/api/my-trips">My Trips</Button>
                    </div>
                    <div>
                        <Button className={classes.link} href="/api/login">Log in</Button>
                        <Button className={classes.link} href="/api/signup">Sign up</Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div >
    )
}
