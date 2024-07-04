import { Link } from "react-router-dom";
function EnrolledServicesTableRow({ deleteEnrollment , match, service ,  }) {
  return (
    <tr role="row">
      <td>{service.id}</td>
      <td>{service.name}</td>
      <td>{service.details}</td>
      <td>
        <Link to={`/user/services/view/${service.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">View</button>
        </Link>   
          <button
          className="btn btn-sm btn-outline-dark"
          onClick={(e) => deleteEnrollment(service.id)}
        >
          Drop Service
        </button>  
      </td>
    </tr>
  );
}

export default EnrolledServicesTableRow;
