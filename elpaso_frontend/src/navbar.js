import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const { login, currentUser, setUserToken, userToken } = useAuth();

  return (
    <nav className="navbar">
      <div className="links">
        {/* we use Link to in order for react to intercept the requests and not let the server send new html 
        pages where the react component is injected. INstead, return the react directly, which will be faster */}
        <Link to="/">Home</Link>
        <Link to="/information">About</Link>
        <Link to="/contact">Contact</Link>
        {!currentUser && <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
