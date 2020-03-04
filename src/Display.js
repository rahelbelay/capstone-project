import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import LogIn from "./LogIn";
import SignUpForm from "./SignUpForm";
import TripCreateForm from "./TripCreateForm";
import MyTrips from "./MyTrips";
import TripDetail from "./TripDetail";
import history from "./history";

export default function App() {
    return (
        <Router history={history}>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/api/create-trip">Create Trip</Link>
                        </li>
                        <li>
                            <Link to="/api/my-trips">My Trips</Link>
                        </li>
                        <li>
                            <Link to="/api/signup">Sign up</Link>
                        </li>
                        <li>
                            <Link to="/api/login">Log In</Link>
                        </li>
                        <li>{/* <Link to="/api/trip-detail">Trip Detail </Link> */}</li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/api/my-trips">
                        <MyTrips />
                    </Route>
                    <Route path="/api/signup">
                        <SignUpForm />
                    </Route>
                    <Route path="/api/login">
                        <LogIn />
                    </Route>
                    <Route path="/api/create-trip">
                        <TripCreateForm />
                    </Route>
                    <Route path="/api/trip-detail/:id">
                        <TripDetail />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
