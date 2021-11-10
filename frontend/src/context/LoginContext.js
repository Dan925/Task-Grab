import React, { createContext,useState } from "react";
import LocalStorageService from '../services/LocalStorageService';

const isLoggedIn = LocalStorageService.getAccessToken();

export const LoginContext = createContext();

const LoginContextProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = useState(isLoggedIn?true:false);
    return (
        <LoginContext.Provider value={{loggedIn,setLoggedIn}}>
            {children}
        </LoginContext.Provider>
            
    )
}



export default LoginContextProvider;