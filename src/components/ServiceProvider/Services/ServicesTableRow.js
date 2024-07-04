import { Link } from "react-router-dom";
function ServicesTableRow({ match, service, deleteService }) {
  return (
    <tr role="row">
      <td>{service.id}</td>
      <td>{service.name}</td>
      <td>{service.details}</td>
      <td>
        <Link to={`${match.url}/view/${service.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">View</button>
        </Link>
        <Link to={`${match.url}/edit/${service.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={(e) => deleteService(service.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ServicesTableRow;
