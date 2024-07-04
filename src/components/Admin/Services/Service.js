import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";


function Service() {
  const token = reactLocalStorage.get("token");
  const [reviews, setReviews] = useState([]);
  const [service, setService] = useState([]);
  
  let { id } = useParams();
  useEffect(() => {
    let getServiceData = async () => {
      await axios
        .get(`http://localhost:5000/admin/services/show/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setService(response.data.result[0]);
            setReviews(response.data.reviews);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getServiceData();
  }, []);
  const deleteReview = async (id) => {
    await axios
      .delete(`http://localhost:5000/user/services/reviews/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const newReviews = reviews.filter((review) => review.id !== id);
        setReviews(newReviews);
      });
  };

  return (
    <div id="content" className="mx-3">
      <div className="container">
        <h3 className="card-title text-center my-5">Service Details</h3>
        <div className="row">
          
          <div className="col-md-12">
            <div className="card">
              <div className="card-header border d-flex justify-content-between">
                <h4 className="card-title mb-0">{service.name} By {service.service_provider_firstname + " " + service.service_provider_lastname}</h4>
                <div>
                  <Link to={`../../service-providers/profile/${service.service_provider_id}`}>
                    <button className="btn btn-outline-dark btn-sm mr-1">
                      View Service Provider Profile
                    </button>
                  </Link> 
                  <Link to={`/admin/services/hired-services/${service.id}`}>
                    <button className="btn btn-outline-dark btn-sm mr-1">
                      hired services
                    </button>
                  </Link>
                </div>
              </div>
              <div className="card-body h-100">
                
                <p className="no-margin-bottom">{service.details} </p>
                {reviews.map((review) => (
                  <div className="media mb-4">
                    <img
                      src={`/uploads/${review.user_photo}`}
                      alt={service.user_name}
                      width="36"
                      height="36"
                      className="rounded-circle mr-2"
                    />
                    <div className="media-body">
                      <strong>
                        {review.user_firstname} {review.user_Lastname}
                      </strong>{" "}
                      added a review on <strong>{service.name}</strong>'s Service
                         <span
                    className="btn btn-outline-dark btn-sm float-right my-2"
                    onClick={(e) => deleteReview(review.id)}
                    >
                    Delete
                  </span>

                      <br />
                      <small className="text-muted">{review.created_at}</small>
                      <div className="row">
                        <div className="col-md-6 text-warning font-weight-bold">
                          <StarRatings
                            rating={review.reviews}
                            starRatedColor="#FFDF00"
                            starDimension="20px"
                            starSpacing="2px"
                            numberOfStars={5}
                          />
                        </div>
                      </div>
                      <div className="border text-sm text-muted p-2 ml-3">
                        {review.reviews_details}
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Service;

