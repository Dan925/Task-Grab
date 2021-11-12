import axios from "axios";
import LocalStorageService from "./LocalStorageService";

//Base Config
const baseURL = "http://localhost:8000/api/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authentication: LocalStorageService.getAccessToken()
      ? "JWT " + LocalStorageService.getAccessToken()
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: LocalStorageService.getAccessToken()
      ? "JWT " + LocalStorageService.getAccessToken()
      : null,
  },
});

//Handling errors and access token being expired

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    //uncaught errors
    // console.log("refreshing...")
    if (typeof error.response === "undefined") {
      alert("Server/network error occured...could be CORS");
      return Promise.reject(error);
    }
    //Protect from looping through trying to create more tokens
    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "token/refresh/"
    ) {
      window.location.href = "/login/";
      return Promise.reject(error);
    }

    //refresh tokens
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = LocalStorageService.getRefreshToken();
      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
        const now = Math.ceil(Date.now() / 1000);
        if (tokenParts.exp > now) {
          return axiosInstance
            .post("token/refresh/", {
              refresh: refreshToken,
            })
            .then((res) => {
              if (res.status === 200) {
                LocalStorageService.setTokens(res.data);
                axiosInstance.defaults.headers["Authorization"] =
                  "JWT " + res.data.access;
                originalRequest.headers["Authorization"] =
                  "JWT " + res.data.access;

                return axiosInstance(originalRequest);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Refresh token expired");
          //redirect to login page
          window.location.href = "/login/";
        }
      } else {
        console.log("Refresh token not available check local storage");
        //redirect to login page
        window.location.href = "/login/";
      }
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
