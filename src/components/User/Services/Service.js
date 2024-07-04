import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import StarRatings from "react-star-ratings";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Service() {
  const token = reactLocalStorage.get("token");
  const user_id = reactLocalStorage.get("user_id");
  const [reviews, setReviews] = useState([]);
  const [service, setService] = useState([]);
  const [enrollment, setEnrollment] = useState();
  const [checkReview, setCheckReview] = useState(true);
  const [rating, SetRating] = useState(1);
  const [reviewDetails, SetReviewDetails] = useState("");

  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/user/services/show/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setService(response.data.result[0]);
            setReviews(response.data.reviews);
            setEnrollment(response.data.enrollment_id);
            response.data.reviews.map((review) => {  
            if(review.user_id == user_id){
                setCheckReview(false);
            }
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, [checkReview,enrollment]);

  const enroll = async (id) => {
    await axios
      .post(
        `http://localhost:5000/user/services/enroll/`,
        {
          service_id: service.id,
          service_provider_id: service.service_provider_id,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        if (res.data.enrollment_id) {
          setEnrollment(res.data.enrollment_id);
        }
      });
  };

  const deleteEnrollment = async (id) => {
    await axios
      .delete(`http://localhost:5000/user/services/enrollment/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        setEnrollment(false);
        setCheckReview(true)
      });
  };
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
        setCheckReview(true)
      });
  };

  const changeRating = (newRating, name) => {
    SetRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:5000/user/services/review",
        {
          service_id: service.id,
          service_provider_id: service.service_provider_id,
          enorllment_id: enrollment,
          reviews:rating,
          reviews_details:reviewDetails,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then(
        (response) => {
          if (response.data.success) {
            SetRating(1);
            SetReviewDetails('');
            setCheckReview(false)
          } 
        },
        (error) => {
          console.log(error);
        }
      );
  };

  return (
    <div id="content" className="mx-3">
      <div className="container">
        <h3 className="card-title text-center my-5">Service Details</h3>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">{service.name} By {service.service_provider_firstname + " " + service.service_provider_lastname}</h4>

           <div>
           
                  <Link
                    to={`/user/services/service-provider-profile/${service.service_provider_id}`}
                  >
                    <button className="btn btn-outline-dark btn-sm mb-1 mr-1">
                      View Service Provider Profile
                    </button>
                  </Link>
                {enrollment ? (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => deleteEnrollment(service.id)}
                  >
                    Drop Service
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => enroll(service.id)}
                  >
                    <i className="fa fa-book mr-1"></i>Enroll Service
                  </button>
                )}
            </div>
              </div>
              <div className="card-body h-100">
                <p className="no-margin-bottom">{service.details} </p>
                <hr />
                  {checkReview ? 
                    enrollment ?
                      <div className="card-body">
                        <h5 className="h6 card-title">Add Review</h5>
                          <form onSubmit={handleSubmit} className="needs-validation">
                            <div className="row">
                              <div className="form-group col-md-12">
                                <textarea
                                  name="details"
                                  className="form-control input"
                                  id="details"
                                  placeholder="Your Review"
                                  onChange={(e) => {
                                    SetReviewDetails(e.target.value);
                                  }}
                                  value={reviewDetails}
                                  rows="2"
                                  required
                                ></textarea>
                              </div>
                              <div className="form-group col-md-12">
                                <StarRatings
                                  rating={rating}
                                  starRatedColor="#FFDF00"
                                  starHoverColor="#fff"
                                  starDimension="25px"
                                  starSpacing="2px"
                                  changeRating={changeRating}
                                  numberOfStars={5}
                                  name="rating"
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <button
                                  type="submit"
                                  className="form-control btn btn-sm btn-outline-primary"
                                >
                                  Add Review
                                </button>
                              </div>
                            </div>
                          </form>
                      </div>
                    :null
                  :null
                  }
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
                    {review.user_id == user_id &&  
                      <button
                      className="btn btn-sm btn-outline-danger float-right my-2"
                      onClick={(e) => deleteReview(review.id)}
                      >
                      Delete Review
                    </button>
                    }

                      <br />
                      <small className="text-muted">{review.created_at}</small>
                      <div className="row">
                        <div className="col-md-12 my-1">
                          <StarRatings
                            rating={review.reviews}
                            starRatedColor="#FFDF00"
                            starDimension="20px"
                            starSpacing="2px"
                            numberOfStars={5}
                          />
                        </div>
                         
                      </div>
                      <div className="text-sm text-muted pl-3 ">
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
