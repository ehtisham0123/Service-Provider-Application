import "./Chat.css";
import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link,useParams } from "react-router-dom";
import ChatMessages from "./ChatMessages";
function Chat() {
const token = reactLocalStorage.get("token");
  const [serviceProviders, setServiceProviders] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    let getServiceProvidersData = async () => {
      await axios
        .get(`http://localhost:5000/user/chat/`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setServiceProviders(response.data.result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getServiceProvidersData();
  }, []);

  const searchServiceProvider = async (name) => {
    await axios
      .get(`http://localhost:5000/user/chat/${name}`,{
          headers: {
            token: token,
          }
        })
      .then((response) => {
        if (response.data) {
          setServiceProviders(response.data.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };



  return (
   <div id="content" className="p-1 p-md-5 pt-5 content">
     <div className="container-fluid h-100">
      <div className="row justify-content-center h-100">
        <div className="col-5 col-md-4 chat">
          <div className="card chat_card mb-sm-3 mb-md-0 contacts_card">
            <div className="card-header card_header">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => searchServiceProvider(e.target.value)}
                  className="form-control search"
                />          
              </div>
            </div>
            <div className="card-body card_body contacts_body">
              <ui className="contacts">
              {serviceProviders.map((serviceProvider) => (
              <Link  style={{ textDecoration: 'none' }}  to={`/user/chat/${serviceProvider.id}`} > 
                <li 
                 className={`${
                    id == serviceProvider.id ? "chat_active" : ""
                  }`}
                >
                  <div className="d-flex bd-highlight">
                    <div className="img_cont">
                      <img
                        src={`/uploads/${serviceProvider.avatar}`} alt={serviceProvider.name}
                        className="rounded-circle user_img"
                      />
                    </div>
                    <div className="user_info">
                      <span>{serviceProvider.name}</span>
                       <p>{serviceProvider.firstname} {serviceProvider.lastname}</p>
                    </div>
                  </div>
                </li>
              </Link>            
                ))}
              </ui>
            </div>
          </div>
        </div>
        <ChatMessages serviceProviderId={id}/>
      </div>
    </div> 
    </div>
  );
}

export default Chat;



