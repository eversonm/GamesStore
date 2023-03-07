import React, { useState, useContext } from "react";

import Card from "../components/UIElements/Card";
import Input from "../components/FormElements/Input";
import Checkbox from "../components/FormElements/CheckBox";
import Button from "../components/FormElements/Button";
import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../util/validators";

import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import "./Auth.css";

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      remember: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    let expiration;
    if (formState.inputs.remember.value === "true") {
      expiration = new Date(new Date().getTime() + 1000 * 3600 * 24 * 15);
    } else {
      expiration = new Date(new Date().getTime() + 1000 * 3600);
    }
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        // "http://localhost:5000/api/users/login",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(responseData.userId, responseData.token, expiration);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className="center">Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address!"
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(10)]}
            errorText="Please enter a valid password, at least 6 characteres!"
            onInput={inputHandler}
          />
          <Checkbox
            id="remember"
            element="checkbox"
            type="checkbox"
            label="Remember Me"
            onInput={inputHandler}
            validators={[]}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Login
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
