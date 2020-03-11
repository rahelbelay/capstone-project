import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LogIn from "./LogIn";
import SignUpForm from "./SignUpForm";
import TripCreateForm from "./TripCreateForm";
import MyTrips from "./MyTrips";
import TripDetail from "./TripDetail";
import history from "./history";
import Nav from "./Nav"

import './App.css';

export default function App() {
    return (
        <Router history={history}>
            <>

                <Nav />
                <Switch>
                    <Route path="/api/my-trips"
                        render={(props) => <MyTrips {...props} />}
                    />
                    <Route path="/api/signup">
                        <SignUpForm />
                    </Route>
                    <Route path="/api/login">
                        <LogIn />
                    </Route>
                    <Route path="/api/create-trip">
                        <TripCreateForm />
                    </Route>

                    <Route path="/api/trip-detail/:id"
                        render={(props) => <TripDetail {...props} />}
                    />
                </Switch>
            </>
        </Router >
    );
}
