import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Loader from "../components/Loader";

import { Signin } from '../pages/Auth'


const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user, loading } = useSelector(state => state.userData)


    if (loading) return <Loader />

    if (!user) return <Signin />

    return (
        <Route
            {...rest}
            render={(props) => {
                if (user && !loading && user.isActive) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to="/signin" />;
                }
            }}
        />
    );
};

export default PrivateRoute;
