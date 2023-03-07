import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import { useAuth } from "./hooks/auth-hook";
import { AuthContext } from "./context/auth-context";
import MainNavigation from "./components/Navigation/MainNavigation";

import Auth from "./pages/Auth";
import CartProvider from "./context/CartProvider";
import Products from "./components/Products/Products";
import Orders from "./pages/Orders";

function App() {
  const {token, login, logout, userId} = useAuth();
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/store" exact>
          <Products />
        </Route>
        <Route path="/orders" exact>
          <Orders />
        </Route>
        <Redirect to="/store" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <CartProvider>
        <Router>
          <MainNavigation />
          <main>{routes}</main>
        </Router>
      </CartProvider>
    </AuthContext.Provider>
  );
}

export default App;
