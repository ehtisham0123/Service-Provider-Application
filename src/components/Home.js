import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";

function Home() {
  const token = reactLocalStorage.get("token");
  const [response, setResponse] = useState([]);
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/`, {
        headers: {
          token: token,
        },
      })
        .then((response) => {
          if (response.data) {
            setResponse(response.data.result[0]);    
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);
  return (
  <div id="content" className="p-4 p-md-5 pt-5">
    <h2 className="text-center mb-4">Service Provider</h2>
    <div class="container ml-4">
      <div class="row py-2">
        <div class="col-6 text-center">
          <div class="row">
            <div class="col-3">
              <div
                class="card home-border home-bg"
                style={{width: "150px", height: "150px"}}
              >
                <div class="card-body home-body home-body-border ">
                  <h4 class="card-title text-uppercase m-0 ">
                    {response.services}  
                       
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-6">
              <h3 class="h5  home-serv homeserv-border">    
                 Services
                </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-md-center py-2">
        <div class="col-6 text-center">
          <div class="row">
            <div class="col-3">
              <div
                class="card home-border home-bg"
                style={{width: "150px", height: "150px"}}
              >
                <div class="card-body home-body home-body-border ">
                  <h4 class="card-title text-uppercase m-0  ">
                        {response.serviceProviders} 
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-6">
              <h3 class="h5 home-serv homeserv-border">
                Service Providers
              
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-md-end py-2 ">
        <div class="col-6 text-center">
          <div class="row">
            <div class="col-3">
              <div
                class="card home-border home-bg"
                style={{width: "150px", height: "150px"}}
              >
                <div class="card-body home-body home-body-border ">
                  <h4 class="card-title text-uppercase m-0  ">
                    {response.users}
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-6">
              <h3 class="h5 home-serv homeserv-border">
                  Users
              </h3>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </div>
  );
}

export default Home;



