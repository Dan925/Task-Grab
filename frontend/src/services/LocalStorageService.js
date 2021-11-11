import jwt_decode from "jwt-decode"
const LocalStorageService = (function(){
    const setTokens = (tokens)=>{
        const payload = jwt_decode(tokens.access);
        const user = {first_name:payload.first_name,last_name:payload.last_name,email:payload.email}
        localStorage.setItem('user',JSON.stringify(user));
        localStorage.setItem('access_token',tokens.access);
        localStorage.setItem('refresh_token',tokens.refresh);
       
    }

    const getAccessToken = ()=>{
        return localStorage.getItem('access_token') ?? null;
    }

    const getRefreshToken = ()=>{
        return localStorage.getItem('refresh_token') ?? null;
    }
    const getUser = ()=>{
        const userStr = localStorage.getItem('user');
        if(userStr)
            return JSON.parse(userStr);
        return null;
    }

    const clearStorage = ()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }



    return{
        setTokens,
        getAccessToken,
        getRefreshToken,
        getUser,
        clearStorage,
    
    }
})();

export default LocalStorageService;
  





