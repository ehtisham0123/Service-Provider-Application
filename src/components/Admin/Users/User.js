import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import LocationShowModal from "../../LocationShowModal";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

function User() {
  const token = reactLocalStorage.get("token");
  const [user, setUser] = useState([]);
  const [services, setServices] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/admin/users/profile/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setUser(response.data.result[0]);
            setServices(response.data.services);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);
  return (
    <div id="content" className="mx-5">
      <div className="text-center my-5 ">
        <h2>User Profile</h2>
      </div>

    <div className="row gutters-sm">
        <div className="col-md-4 mb-3">
          <div className="card -berry edge--bottom">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <img
                  src={`/uploads/${user.avatar}`}
                  alt={user.name}
                  className="rounded-circle"
                  width="200"
                  height="200"
                />
                <div className="mt-3">
                  <h4>{user.name}</h4>
                  <p className="text-success mb-3 mt-4">
                    <span className="text-color">Lives in</span>
                    <span className="ml-1 text-success"> {user.city}</span>
                  </p>
                  <p className="text-muted font-size-sm">
                    <span className="text-color">From</span>
                    <span className="ml-1 text-success"> {user.country}</span>
                  </p>
                           <Link to={`../../users/edit/${user.id}`}>
           <button className="btn btn-outline-dark">
                      <i className="fa fa-edit"></i> Edit Profile
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card mb-3 -berry edge--bottom">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Full Name</h6>
                </div>
                <div class="col-sm-9 text-success mb-4">
                  {user.firstname} {user.lastname}
                </div>
              </div>

              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Email</h6>
                </div>
                <div class="col-sm-9 text-success mb-4">{user.email}</div>
              </div>

              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Phone</h6>
                </div>
                <div class="col-sm-9 text-success mb-4">{user.contact}</div>
              </div>

              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Gender</h6>
                </div>
                <div class="col-sm-9 text-success mb-4">{user.gender}</div>
              </div>

              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">House no</h6>
                </div>
                <div class="col-sm-9 text-success mb-4">
                  {user.housenumber ? (
                    user.housenumber
                  ) : (
                    <p className="text-success">Null </p>
                  )}
                </div>
              </div>

              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Street</h6>
                </div>
                <div class="col-sm-9 text-success mb-4">
                  {user.streetnumber ? (
                    user.streetnumber
                  ) : (
                    <div className="text-success">Null</div>
                  )}
                </div>
              </div>

              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">State</h6>
                </div>
                <div class="col-sm-9 text-success mb-4">
                  {user.state ? (
                    user.state
                  ) : (
                    <div className="text-success">Null</div>
                  )}
                </div>
              </div>

              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Postal code</h6>
                </div>
                <div class="col-sm-9 text-success mb-4">{user.postalcode}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
         <div className="row gutters-sm mt-1">
        <div className="col-sm-6 h-100 mb-3">
          <LocationShowModal
            latitude={user.latitude}
            longitude={user.longitude}
          />
        </div>
        <div className="col-sm-6 mb-3">
          <div
            className="card -berry edge--bottom"
            style={{ height: "325px", "overflow-y": "auto" }}
          >
            <div className="card-body">
              <h6 className="d-flex align-items-center mb-3">
                <i className="material-icons text-success mr-2">Hired Services</i>
              </h6>
              {services.map((service) => (
                <div className="row">
                  <div className="col-sm-10">
                <h5 className="headings">{service.name}</h5>
             </div>
                  <div className="col-sm-2 text-success  text-right">
                    <p>
                                  <Link to={`../../services/view/${service.id}`}>
                     <button className="btn btn-sm btn-outline-dark mr-1">
                                View
                              </button>
                            </Link>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
 