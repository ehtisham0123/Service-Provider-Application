import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";

function CreateService() {
  const token = reactLocalStorage.get("token");
  const [formdata, setFormData] = useState({
    name: "",
    details: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    details: "",
  });
  const [success, setSuccess] = useState("");
  let { id } = useParams();

  useEffect(() => {
    let getServiceData = async () => {
      await axios
        .get(`http://localhost:5000/service-provider/services/edit/${id}`, {
        headers: {
          token: token,
        },
      })
        .then((response) => {
          if (response.data) {
            setFormData(response.data.result[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getServiceData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    switch (name) {
      // checking service name
      case "name":
        if (value.length < 3) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Service Name length must be atleast 3 characters",
          }));
        } else if (value.length > 26) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Service Name must not exceed 25 characters",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      // checking service details
      case "details":
        if (value.length < 8) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Service Details length must be atleast 8 characters",
          }));
        } else if (value.length > 500) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Service Details must not exceed 500 characters",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    setSuccess("");
    e.preventDefault();
    if (errors.name == "" && errors.details == "") {
      await axios.put(`http://localhost:5000/service-provider/services/update`, formdata, {
          headers: {
            token: token,
          },
        }).then(
        (response) => {
          if (response.data.success) {
            setSuccess(response.data.success);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  return (
    <div id="content" className="mx-5">
      <div className="text-center my-5 ">
        <h2>Edit Service</h2>
      </div>
      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="row">
          <div className="form-group col-md-12">
            <label for="name">Service Name</label>
            <input
              type="text"
              name="name"
              className={`form-control input ${errors.name ? "is-invalid" : ""}`}
              id="name"
              placeholder="Service Name"
              onChange={handleChange}
              value={formdata.name}
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="form-group col-md-12">
            <label for="details">Details</label>
            <textarea
              name="details"
              className={`form-control input ${errors.details ? "is-invalid" : ""}`}
              id="details"
              placeholder="Details"
              onChange={handleChange}
              value={formdata.details}
              rows="5"
            ></textarea>
            {errors.details && (
              <div className="invalid-feedback">{errors.details}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-12">
            {success && (
              <div class="alert alert-primary" role="alert">
                {success}
              </div>
            )}
          </div>
          <div className="form-group col-md-12">
            <button type="submit" className="form-control input btn btn-outline-dark">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateService;
