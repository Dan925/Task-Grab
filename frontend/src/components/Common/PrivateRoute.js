import React, { useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import { Route, Redirect } from "react-router";

const PrivateRoute = ({ path, component }) => {
  const { state } = useContext(LoginContext);
  return state.isLoggedIn ? (
    <Route exact path={path} component={component} />
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
