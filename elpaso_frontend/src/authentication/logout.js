import React, { useEffect, useRef } from "react";
import { useGoogleLogout } from "react-google-login";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../index.css";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const Logout = () => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const navigate = useNavigate();
  const { setUserToken, setCurrentUser } = useAuth();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  async function onLogoutSuccess(res) {
    console.log("Sucessfully logged out from Google:", res);
    setUserToken(false);
    setCurrentUser(false);
    localStorage.clear();
  }

  async function onFailure(res) {
    console.log("Logout from Google was not completed. ", res);
  }
  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });

  async function logOutFirebase() {
    if (isMounted.current) {
      try {
        auth.signOut();
        setUserToken(false);
        setCurrentUser(false);
        localStorage.clear();
      } catch {
        console.log("Logout from firebase failed.");
      }
    }
  }

  const globalLogout = () => {
    if (isMounted.current) {
      logOutFirebase(); // try except aici? Nu se prind erorile cu nimic.
      signOut();
      navigate("/");
    }
  };

  return (
    <ListItem button onClick={globalLogout}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Log Out" />
    </ListItem>
  );
};

export default Logout;
