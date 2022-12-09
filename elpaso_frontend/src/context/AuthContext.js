import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userToken, setUserToken] = useState(false);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const tok = localStorage.getItem("token");
      setUserToken(tok);

      const storageUser = JSON.parse(
        JSON.stringify(localStorage.getItem("user"))
      );
      if (storageUser != null) setCurrentUser(JSON.parse(storageUser));
      else setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userToken,
    setUserToken,
    login,
    signup,
    logout,
    setCurrentUser,
  };
  // all the components in the AuthCOntext.PRovider have access to the value variable. IN app, every component is in the auth provider so they can all access
  // this

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
