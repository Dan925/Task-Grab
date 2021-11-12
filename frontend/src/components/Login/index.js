import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../services/Axios";
import LocalStorageService from "../../services/LocalStorageService";
import Utils from "../../utils";
import CustomBtn from "../Common/Button";
import { Redirect } from "react-router";

export default function Login() {
  const { t } = useTranslation();
  const [values, setValues] = useState({ email: "", password: "" });

  const [validEmail, setValidEmail] = useState(true);

  const [validPassword, setValidPassword] = useState(true);
  const [errors, setErrors] = useState(new Array(2).fill(false));

  const [wrongCredentials, setWrongCredentials] = useState(false);
  const { state, dispatch } = useContext(LoginContext);
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (name === "email") {
      setValidEmail(Utils.validateEmail(value));
    } else {
      setValidPassword(Utils.validatePassword(value));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let v = [false, false];
    if (!validEmail) v[0] = true;
    if (!validPassword) v[1] = true;

    setErrors(v);

    if (
      values.email.length > 0 &&
      validEmail &&
      values.password.length > 0 &&
      validPassword
    ) {
      axiosInstance
        .post("token/", values)
        .then((res) => {
          if (res.status === 200) {
            setWrongCredentials(false);
            LocalStorageService.setTokens(res.data);
            axiosInstance.defaults.headers["Authorization"] =
              "JWT " + res.data.access;
            dispatch({ type: "LOGIN", payload: LocalStorageService.getUser() });
            history.push("/dashboard");
          }
        })
        .catch((err) => {
          setWrongCredentials(true);
          console.log(err);
        });
    }
  };
  return (
    <div>
      {state.isLoggedIn ? (
        <Redirect to="/dashboard" />
      ) : (
        <form className="custom-form">
          <h2>{t("Login.header")}</h2>
          <label>{t("Login.label1")}</label>
          <input
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder={t("Login.label1")}
            required
          />

          {errors[0] && (
            <p style={{ color: "red", fontSize: "0.8em" }}>
              {t("Login.error1")}
            </p>
          )}

          <label>{t("Login.label2")}</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
            placeholder={t("Login.label2")}
          />

          {errors[1] && (
            <p style={{ color: "red", fontSize: "0.8em" }}>
              {t("Login.error2")}
            </p>
          )}
          {wrongCredentials && (
            <p style={{ color: "red", fontSize: "0.8em" }}>
              Incorrect email or password
            </p>
          )}

          <CustomBtn fullWidth onClick={handleLogin}>
            {t("Login.btn")}
          </CustomBtn>
          <div className="ftlg">
            <Link to="/signup">{t("Login.link")}</Link>
          </div>
        </form>
      )}
    </div>
  );
}
