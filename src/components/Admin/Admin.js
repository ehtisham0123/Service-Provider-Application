import Home from "../Home";
import Users from "./Users/Users";
import CreateUser from "./Users/CreateUser"; 
import EditUser from "./Users/EditUser"; 
import User from "./Users/User";

import ServiceProviders from "./ServiceProviders/ServiceProviders";
import CreateServiceProvider from "./ServiceProviders/CreateServiceProvider";
import EditServiceProvider from "./ServiceProviders/EditServiceProvider"; 
import ServiceProvider from "./ServiceProviders/ServiceProvider";

import Services from "./Services/Services";
import HiredServices from "./Services/HiredServices";
import EditService from "./Services/EditService"; 
import Service from "./Services/Service";

import {useState} from "react";
import { Link ,Switch ,Route} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';

import logo from "../../logo.PNG";


function Admin({history,match,location}) {
  
  const checkUsers =  location.pathname.includes("admin/users");
  const checkServiceProviders =  location.pathname.includes("admin/service-providers");
  const checkServices =  location.pathname.includes("admin/services");
  const [active, setActive] = useState(false);

  const logout = ()=>{
    reactLocalStorage.remove('token');
    reactLocalStorage.remove('user_id');
    reactLocalStorage.remove('user_role');
    history.push("/admin-login");
  }

  const toggleClass = () => {
      const currentState = active;
      setActive(!currentState );
  };

  if (!reactLocalStorage.get('token')){
    history.push("/admin-login");
   }
  else if (reactLocalStorage.get('user_role') !== 'admin'){
    logout();    
    history.push("/admin-login");
   
   }


  return (
      <div className="wrAdminer d-flex align-items-stretch">
        <nav id="sidebar" className={active ? 'active': null}>
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
            <Link to={`${match.url}`}>
              <li 
               className={`${location.pathname === "/admin"  ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-home mr-3"></span> Home
                </a>
              </li>
            </Link>


           <Link to={`${match.url}/service-providers`}>
              <li
              className={`${checkServiceProviders ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-user mr-3"></span>
                  Service Providers
                </a>
              </li>
            </Link>              


           <Link to={`${match.url}/users`}>
              <li
              className={`${checkUsers ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-male mr-3"></span>
                  Users
                </a>
              </li>
            </Link>   
            <Link to={`${match.url}/services`}>
              <li
              className={`${checkServices ? "active" : ""}`} 
              >
                <a href="#">
                  <span className="fa fa-briefcase mr-3" aria-hidden="true"></span>
                  Services
                </a>
              </li>
            </Link>   
            <Link onClick={logout}>
              <li>
                <a>
                   <span className="fa fa-sign-out mr-3" aria-hidden="true"></span>
                    Logout
                </a>  
              </li>
            </Link>    
          </ul>
        </nav>
        <Switch>

          <Route exact path={`${match.path}`}  component={Home} />
    
          <Route exact path={`${match.path}/users`} component={Users} />
          
          <Route path={`${match.path}/users/create`} component={CreateUser}/>
             
          <Route path={`${match.path}/users/profile/:id`} component={User}/>
                      
          <Route path={`${match.path}/users/edit/:id`} component={EditUser}/>
          
          

          <Route exact path={`${match.path}/service-providers`} component={ServiceProviders} />
          
          <Route path={`${match.path}/service-providers/create`} component={CreateServiceProvider}/>
             
          <Route path={`${match.path}/service-providers/profile/:id`} component={ServiceProvider}/>
                      
          <Route path={`${match.path}/service-providers/edit/:id`} component={EditServiceProvider}/>



          <Route exact path={`${match.path}/services`} component={Services} />
          
          <Route exact path={`${match.path}/services/hired-services/:id`} component={HiredServices} />
             
          <Route path={`${match.path}/services/view/:id`} component={Service}/>
                      
          <Route path={`${match.path}/services/edit/:id`} component={EditService}/>
             
        </Switch>
      </div>
  );
}

export default Admin;
