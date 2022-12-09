import React, { useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const clientId = process.env.REACT_APP_CLIENT_ID;

const GoogleComponent = () => {
  const navigate = useNavigate();
  const { currentUser, setUserToken, setCurrentUser } = useAuth();

  const RefreshTokenSetup = (res) => {
    let refreshTiming = 3300 * 1000;
    console.log(refreshTiming + " started countdown to refresh..");
    // 3300 sec / 60 = 55 min pana la expirare. 3300 * 1000 = in milisec.
    const refreshToken = async () => {
      const newAuthRes = await res.reloadAuthResponse();
      refreshTiming = 3300 * 1000;
      console.log("Token expired -- new token generated:", newAuthRes);
      setCurrentUser(localStorage.getItem("user"));
      localStorage.setItem("token", JSON.stringify(newAuthRes.id_token));
      setUserToken(newAuthRes.id_token);

      // fetch("http://localhost:8000/app/google_login", {
      fetch("http://localhost:8000/google_login", {
        method: "POST",
        headers: {
          Authorization: `${res.id_token}`,
        },
      }).then((resp) =>
        resp.json().then((resp) => {
          console.log("status: " + resp.status);
          return resp;
        })
      );
      setTimeout(refreshToken, refreshTiming);
    };
    setTimeout(refreshToken, refreshTiming);
  };

  useEffect(() => {
    // console.log(clientId);
  }, []);

  const onSuccess = (res) => {
    console.log(res);
    RefreshTokenSetup(res);
    // localStorage.setItem("token", JSON.stringify(res.tokenId));
    setUserToken(res.tokenId);
    setCurrentUser(res.profileObj);
    localStorage.setItem("token", JSON.stringify(res.tokenId));
    localStorage.setItem("user", JSON.stringify(res.profileObj));
    // the personal information of the user is only returned the first time the token is retrieved/ The profile does not contain the transient token.

    fetch("http://localhost:8000/app/google_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${res.tokenId}`,
      },
    }).then((resp) =>
      resp.json().then((resp) => {
        console.log("status: " + resp.status);
        return resp;
      })
    );
    navigate("/");
  };

  const onFailure = (res) => {
    console.log("Login failed:", res);
  };

  return (
    <div className="google-button">
      <GoogleLogin
        clientId={clientId}
        buttonText="Autentificare"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        className="google_signIn_button"
        isSignedIn={true}
        responseType="hostedDomain"
        prompt="select_account"
      />
    </div>
  );
};

export default GoogleComponent;
