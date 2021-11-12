import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import Utils from "../../utils";
import axiosInstance from "../../services/Axios";
import CustomBtn from "../Common/Button";
import { LoginContext } from "../../context/LoginContext";
import { Redirect } from "react-router";
export default function SignUp() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [matchError, setMatchError] = useState(false);
  const [invalidErrors, setInvalidErrors] = useState(Array(2).fill(false));
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [isEmpty, setEmpty] = useState(false);
  const history = useHistory();
  const { state } = useContext(LoginContext);

  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (name === "email") {
      setValidEmail(Utils.validateEmail(value));
    }
    if (name === "password") {
      setValidPassword(Utils.validatePassword(value));
    }
  };
  const hasEmpty = () => {
    return (
      values.firstName === "" ||
      values.lastName === "" ||
      values.username === "" ||
      values.email === "" ||
      values.password === "" ||
      values.password2 === ""
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasEmpty()) {
      setEmpty(true);
    } else {
      setEmpty(false);
      setMatchError(false);
      setInvalidErrors(Array(2).fill(false));
      if (values.password !== values.password2) {
        setMatchError(true);
      } else {
        setMatchError(false);
        let v = [false, false];
        if (!validEmail) v[0] = true;
        if (!validPassword) v[1] = true;

        setInvalidErrors(v);

        if (validEmail && validPassword) {
          axiosInstance
            .post("users/register/", {
              email: values.email,
              user_name: values.username,
              first_name: values.firstName,
              last_name: values.lastName,
              password: values.password,
            })
            .then((res) => {
              if (res.status === 201) {
                history.push("/login");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
  };
  return (
    <div>
      {state.isLoggedIn ? (
        <Redirect to="dashboard/" />
      ) : (
        <form className="custom-form" method="POST">
          <h2>Create your account</h2>
          <label> Username </label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <label> First Name </label>
          <input
            type="text"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <label> Last Name </label>
          <input
            type="text"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
          <label>{t("Login.label1")}</label>
          {invalidErrors[0] && (
            <p style={{ color: "red", fontSize: "0.8em" }}>
              {t("Login.error1")}
            </p>
          )}
          <input
            type="text"
            name="email"
            value={values.email}
            placeholder={t("Login.label1")}
            onChange={handleChange}
            required
          />
          <label>{t("Login.label2")}</label>
          {invalidErrors[1] && (
            <p style={{ color: "red", fontSize: "0.8em" }}>
              {t("Login.error2")}
            </p>
          )}
          <input
            type="password"
            name="password"
            value={values.password}
            placeholder="New Password"
            onChange={handleChange}
            required
          />
          <label> Confirm Password </label>
          {matchError && (
            <p style={{ color: "red", fontSize: "0.8em" }}>
              Passwords do not match, please enter the same password
            </p>
          )}
          <input
            type="password"
            name="password2"
            value={values.password2}
            onChange={handleChange}
            placeholder="New Password"
            required
          />
          {isEmpty && (
            <p style={{ color: "red", fontSize: "0.8em" }}>
              Please fill in every fields
            </p>
          )}
          <CustomBtn fullWidth onClick={handleSubmit}>
            Sign Up
          </CustomBtn>
        </form>
      )}
    </div>
  );
}
