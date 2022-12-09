import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import GoogleComponent from "./google_login.js";
import { auth } from "../firebase";
import { useMountedState } from "react-use";
import { useAuth } from "../context/AuthContext";
import SideNavbar from "../SideNavbar";
import "./Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const [incorrectCredentials] = useState(false);
  const { login, currentUser, setUserToken, userToken } = useAuth();
  const [error] = useState("");
  // const [token, setToken] = useState("");

  const isMounted = useMountedState();
  useEffect(() => {
    console.log(" use effect for login user ");
    // Se apeleaza de foarte multe ori
    auth.onAuthStateChanged((currentUser) => {
      // We needed this to make sure that we will set the user only
      // when the login is done, aka the user changed.
      // if (currentUser) {
      //   console.log("#### user token : " + JSON.stringify(currentUser));
      // }
    });
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.displayName != null && userToken) {
      // console.log("User token from context is " + userToken);
      navigate("/");
    }
  }, [userToken]);

  async function handleSubmit(e) {
    if (isMounted) {
      e.preventDefault(); // prevent form from refreshing
      // try {
      setIsPending(true);
      const response = await login(email, password);
      const tok = await response.user.getIdToken();
      // setToken(tok);
      setUserToken(tok);
      // console.log("Token is: " + tok);
      localStorage.setItem("token", JSON.stringify(tok));

      fetch("https://elpaso.zapto.org/app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${tok}`,
        },
      }).then((resp) =>
        resp.json().then((resp) => {
          return resp;
        })
      ); /// salveaza in local storage doar daca e verificat tokenul.
      // } catch {
      //   console.log("Failed to log in ");
      //   setIncorrectCredentials(true);
      // }
      setIsPending(false);
    }
  }

  return (
    <div className="login-container">
      <SideNavbar />
      <div className="login">
        <div className="login-inside">
          <h2>Intrati in cont</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email: </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <label>Parola: </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            {!isPending && (
              <button className="logIn_button">Autentificare</button>
            )}
          </form>

          {isPending && <button disabled>Autentificare in curs...</button>}
          {!isPending && incorrectCredentials && <div>Incercati din nou</div>}
          {error && <div>{error}</div>}

          {!isPending && (
            <button
              className="signIn_button"
              onClick={() => {
                console.log("Sign In started");
                navigate("/signin");
              }}
            >
              Inregistrare
            </button>
          )}
          <GoogleComponent />
        </div>
      </div>
    </div>
  );
};

export default Login;
