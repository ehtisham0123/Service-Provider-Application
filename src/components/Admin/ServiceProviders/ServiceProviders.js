import { useState, useEffect } from "react";
import ServiceProvidersTableRow from "./ServiceProvidersTableRow";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Spinner from '../../Spinner.png';

function ServiceProviders({ match, location }) {
  const token = reactLocalStorage.get("token");
  const [loading, setLoading] = useState(false);
  const [serviceProvider, setServiceProviders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceProviderPerPage, setServiceProvidersPerPage] = useState(5);
  const indexOfLastServiceProvider = currentPage * serviceProviderPerPage;
  const indexOfFirstServiceProvider = indexOfLastServiceProvider - serviceProviderPerPage;
  const currentServiceProviders = serviceProvider.slice(
    indexOfFirstServiceProvider,
    indexOfLastServiceProvider
  );

  useEffect(() => {
    setLoading(true);
    let getUsersData = async () => {
      await axios
        .get(`http://localhost:5000/admin/service-providers/`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setServiceProviders(response.data.result);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUsersData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteServiceProvider = async (id) => {
    await axios.delete(`http://localhost:5000/admin/service-providers/${id}`,{
          headers: {
            token: token,
          },
        }).then((res) => {
      const newServiceProviders = serviceProvider.filter((serviceProvider) => serviceProvider.id !== id);
      setServiceProviders(newServiceProviders);
    });
  };

  const searchServiceProvider = async (name) => {
    setLoading(true);
    await axios
      .get(`http://localhost:5000/admin/service-providers/${name}`,{
          headers: {
            token: token,
          }
        })
      .then((response) => {
        if (response.data) {
          setServiceProviders(response.data.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div id="content" className="p-4">
      <div className="card-body">
        <h3 className="card-title text-center">Service Providers table</h3>
        <div className="row d-flex align-items-center justify-content-between  mr-1">
          <div>
            <input
              type="search"
              className="form-control search_bar ml-3"
              placeholder="Search"
              onChange={(e) => searchServiceProvider(e.target.value)}
            />
          </div>
          <Link to={`${match.url}/create`}>
            <button className="btn btn-outline-primary mr-1">
              <i className="fa fa-user-plus"></i> Add ServiceProvider
            </button>
          </Link>
        </div>

        <table
          className="table table-responsive dataTable mt-3"
          role="grid"
          style={{ minHeight: "350px"}}
        >
          <thead> 
            <tr role="row" >
              <th style={{ minWidth: "50px" }}>Photo</th>
              <th style={{ minWidth: "50px" }}>Name</th>
              <th style={{ minWidth: "200px" }}>Email</th>
              <th style={{ minWidth: "50px" }}>Contact</th>
              <th style={{ minWidth: "50px" }}>Gender</th>
              <th style={{ minWidth: "50px" }}>City</th>
              <th style={{ minWidth: "180px" }}>Actions</th>
                </tr>
          </thead>
           {loading ? (
              <div className="loading">
                  <img src={Spinner} className="loader" alt="loader" />
                  <h2>Loading</h2>
              </div>
            ) : (
          <tbody>
           
              {currentServiceProviders.map((serviceProvider) => (
                <ServiceProvidersTableRow match={match} serviceProvider={serviceProvider} deleteServiceProvider={deleteServiceProvider}/>
              ))}
          </tbody>
            )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstServiceProvider + 1} to {indexOfLastServiceProvider} of{" "}
            {serviceProvider.length} entities
          </div>
          <div class="col-4">
            <label>
              <select
                class="form-control select"
                onChange={(e) => {
                  setServiceProvidersPerPage(e.target.value);
                }}
                value={serviceProviderPerPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-center">
            <Pagination
              serviceProvidersPerPage={serviceProviderPerPage}
              totalServiceProviders={serviceProvider.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceProviders;
