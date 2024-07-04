import { Link } from "react-router-dom";
function ServicesTableRow({ match, service, deleteService }) {
  return (
    <tr role="row">
      <td>{service.name}</td>
      <td>{service.details}</td>
      <td>{service.service_provider_name}</td>
      <td>
        <Link to={`${match.url}/view/${service.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">View</button>
        </Link>
        <Link to={`${match.url}/edit/${service.id}`}>
          <button className="btn btn-sm btn-outline-secondary mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteService(service.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ServicesTableRow;
