import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import { Link,useParams } from "react-router-dom";
import axios from "axios";
import Pusher from 'pusher-js';

function ChatMessages() {

  const token = reactLocalStorage.get("token");
  const user_id = reactLocalStorage.get("user_id");
  const [user, setStudent] = useState([]);
  const [serviceProvider, setServiceProvider] = useState([]);
  let [messages, setMessages] = useState([]);
  const [input , setInput] = useState('');
  let { id } = useParams();

    useEffect(() => {
     var pusher = new Pusher('ea25a3949b7662bf5669', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      if(id == newMessage.user_id && user_id == newMessage.service_provider_id){
        setMessages([...messages, newMessage])
      }
    });

    return() => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[messages]);

  useEffect(() => {
    let getStudentData = async () => {
      await axios
        .get(`http://localhost:5000/service-provider/chat/user/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setStudent(response.data.result[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getStudentData();

      let getServiceProviderData = async () => {
      await axios
        .get(`http://localhost:5000/service-provider/chat/avatar`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setServiceProvider(response.data.result[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getServiceProviderData();

      let getMessages = async () => {
      await axios
        .get(`http://localhost:5000/service-provider/chat/messages/${id}`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setMessages(response.data.messages);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getMessages();



  }, [id]);

  const handleMessage = (e) => {
    setInput(e.target.value);
  }       
  const handleSubmit = (e) => {
  e.preventDefault()
  axios.post('http://localhost:5000/service-provider/chat/messages/new',
  {
    message: input,
    user_id:id,
  },{
          headers: {
            token: token,
          },
        })
.then(function (response) {
    setInput('');
  })
 .catch(function (error) {
    console.log(error);
  });
  }
 
 

  return (
      !user?
        <div className="col-7 col-md-8 chat">
          <div className="card chat_card">
            <div className="card-body welcome_card_body">     
                <h2 className="mt-2">Welcome To Chat</h2>
            </div>
          </div>   
        </div>
        :<div className="col-7 col-md-8 chat">
          <div className="card chat_card">
            <div className="card-header card_header msg_head">
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <img
                     src={`/uploads/${user.avatar}`} alt={user.name}
                     className="rounded-circle user_img"
                  />
                </div>
                <div className="user_info">
                  <span>{user.name}</span>
                
                   <Link to={`/service-provider/services/user-profile/${user.id}`}>
         
                    <p>{user.firstname} {user.lastname}</p>
        </Link>
                

                </div>
              </div>
            </div>
            <div className="card-body msg_card_body">
              
             {messages.map((message) => (
              message.status == 1 ?
              <div className="d-flex justify-content-start mb-4">
                <div className="img_cont_msg">
                  <img
                    src={`/uploads/${user.avatar}`} alt={user.name}
                    className="rounded-circle user_img_msg"
                  />
                </div>
                <div className="msg_cotainer">
                 {message.message}
                </div>
              </div>
              :
              <div className="d-flex justify-content-end mb-4">
                <div className="msg_cotainer_send">
                 {message.message}
                </div>
                <div className="img_cont_msg">
                  <img
                    src={`/uploads/${serviceProvider.avatar}`} alt={serviceProvider.name}
                    className="rounded-circle user_img_msg"
                  />
                </div>
              </div>
              ))}
            </div>
            <div className="card-footer">
            <form onSubmit={handleSubmit} >
              <div className="input-group">
                <input
                  className="form-control type_msg"
                  placeholder="Type your message..."
                  value={input} 
                  onChange={handleMessage}
                  required
                />
                <div className="input-group-append">
                  <button type="submit" className="input-group-text send_btn"
                    >
                    <img src={`/send.png`} style={{width:"26px"}} alt={user.name} />
                    </button>
                </div>
              </div>
                </form>
            </div>
          </div>   
        </div>
  
  );

 
 


}
export default ChatMessages;



