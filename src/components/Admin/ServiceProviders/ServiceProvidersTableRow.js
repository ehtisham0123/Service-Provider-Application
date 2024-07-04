import { Link } from "react-router-dom";
function ServiceProvidersTableRow({match,serviceProvider,deleteServiceProvider}) {
  return (
      <tr role="row">
      <td className="img_cont">
        <img
            style = {{marginTop:"-5px",marginBottom:"-5px"}}
           src={`/uploads/${serviceProvider.avatar}`} alt={serviceProvider.name}
           className="user_img"
        />
      </td>
      <td>{serviceProvider.name}</td>
      <td>{serviceProvider.email}</td>
      <td>{serviceProvider.contact}</td>
      <td>{serviceProvider.gender}</td>
      <td>{serviceProvider.city}</td>
      <td>
        <Link to={`${match.url}/profile/${serviceProvider.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">
            View
          </button>
        </Link>
        <Link to={`${match.url}/edit/${serviceProvider.id}`}>
          <button className="btn btn-sm btn-outline-secondary mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteServiceProvider(serviceProvider.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ServiceProvidersTableRow;
