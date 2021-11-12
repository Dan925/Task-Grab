import React, { createContext, useReducer } from "react";
import LocalStorageService from "../services/LocalStorageService";

const currUser = LocalStorageService.getUser();
const initialState = {
  isLoggedIn: currUser ? true : false,
  user: currUser,
};

const loginReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { isLoggedIn: true, user: action.payload };
    case "LOGOUT":
      return { isLoggedIn: false, user: null };
    default:
      return state;
  }
};
export const LoginContext = createContext(initialState);

const LoginContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  return (
    <LoginContext.Provider value={{ state, dispatch }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
