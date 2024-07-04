import { Link } from "react-router-dom";
function HiredServicesTableRow({ match, user, deleteEnrollment }) {
  return (
    <tr role="row">
      <td>{user.id}</td>
      <td className="img_cont">
        <img
            style = {{marginTop:"-5px",marginBottom:"-5px"}}
           src={`/uploads/${user.avatar}`} alt={user.name}
           className="user_img"
        />
      </td>
      <td>{user.firstname} {user.lastname}</td>
      <td>{user.email}</td>
      <td style={{ display: "flex" }}>
       <Link to={`/admin/users/profile/${user.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">
            View User Profile
          </button>
        </Link>
       <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteEnrollment(user.id)}
        >
          Delete Enrollment
        </button>
      </td>
    </tr>
  );
}

export default HiredServicesTableRow;
