import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import Cart from "../Cart/Cart";
import HeaderCartButton from "../Layout/HeaderCartButton";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const [cartIsShown, setCartIsShown] = useState(false);
  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };
  return (
    <ul className="nav-links">
      {/* {auth.isLoggedIn && <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>} */}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/store">Store</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/orders">Pedidos</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          {cartIsShown && <Cart onClose={hideCartHandler} />}
          <HeaderCartButton onClick={showCartHandler} />
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Login</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
