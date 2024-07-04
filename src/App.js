import "./App.css";
import {reactLocalStorage} from 'reactjs-localstorage';

import Home from "./Home";
import Admin from "./components/Admin/Admin";
import ServiceProvider from "./components/ServiceProvider/ServiceProvider";
import User from "./components/User/User";

import AdminLogin from "./components/Admin/AdminLogin";
import ServiceProviderLogin from "./components/ServiceProvider/ServiceProviderLogin";
import ServiceProviderSignup from "./components/ServiceProvider/ServiceProviderSignup";
import UserLogin from "./components/User/UserLogin";
import UserSignup from "./components/User/UserSignup";

import { Link, Switch, Route } from "react-router-dom";
import { useState } from "react";


import logo from "./logo.PNG";

function App({ location,history }) {



  const [active, setActive] = useState(false);
  const toggleClass = () => {
    const currentState = active;
    setActive(!currentState);
  };
  return (
    <div className="App">
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/service-provider" component={ServiceProvider} />
        <Route path="/user" component={User} />

        <div className="wrapper d-flex align-items-stretch"  >
          <nav id="sidebar" className={active ? "active" : null}>
            <div className="custom-menu">
              <button
                type="button"
                id="sidebarCollapse"
                className="btn btn-primary"
                onClick={toggleClass}
              ></button>
            </div>
            <div
              className="img bg-wrap text-center py-4"
               style={{ backgroundImage: "url(" + logo + ")" }}
            >
              <div className="user-logo">
                <div
                  className="img"
                ></div>
                <h3>Service Provider</h3>
              </div>
            </div>
            <ul className="list-unstyled components mb-5">
              <Link to={`/`}>
                <li className={`${location.pathname === "/" ? "active" : ""}`}>
                  <a>
                    <span className="fa fa-home mr-3"></span>
                    Home
                  </a>
                </li>
              </Link>
              <Link to={`/admin-login`}>
                <li
                  className={`${
                    location.pathname === "/admin-login" ? "active" : ""
                  }`}
                >
                  <a>
                    <span className="fa fa-sign-in mr-3"></span>
                    Admin Login
                  </a>
                </li>
              </Link>
              <Link to={`/service-provider-signup`}>
                <li
                  className={`${
                    location.pathname === "/service-provider-signup" ? "active" : ""
                  }`}
                >
                  <a className="d-flex align-items-center">
                    <span className="fa fa-user-plus mr-3"></span>
                    Service Provider<br />Registration
                  </a>
                </li>
              </Link>
              <Link to={`/service-provider-login`}>
                <li
                  className={`${
                    location.pathname === "/service-provider-login" ? "active" : ""
                  }`}
                >
                  <a className="d-flex align-items-center">
                    <span className="fa fa-sign-in mr-3"></span>                      
                    Service Provider<br/>Login
                  </a>
                </li>
              </Link>

              <Link to={`/user-signup`}>
                <li
                  className={`${
                    location.pathname === "/user-signup" ? "active" : ""
                  }`}
                >
                  <a>
                    <span className="fa fa-user-plus mr-3"></span>
                    User Registration
                  </a>
                </li>
              </Link>
              



              <Link to={`/user-login`}>
                <li
                  className={`${
                    location.pathname === "/user-login" ? "active" : ""
                  }`}
                >
                  <a>
                    <span className="fa fa-sign-in mr-3"></span>
                    User Login
                  </a>
                </li>
              </Link>
             

            </ul>
          </nav>

          <Route exact path="/" component={Home} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/service-provider-login" component={ServiceProviderLogin} />
          <Route path="/service-provider-signup/" component={ServiceProviderSignup} />
          <Route path="/user-login" component={UserLogin} />
          <Route path="/user-signup" component={UserSignup} />
        </div>
      </Switch>
    </div>
  );
}

export default App;
