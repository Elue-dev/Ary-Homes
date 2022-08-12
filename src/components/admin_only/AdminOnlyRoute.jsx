import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectEmail } from "../../redux/slice/authSlice";

export default function AdminOnlyRoute({ children }) {
  const userEmail = useSelector(selectEmail);

  if (userEmail === process.env.REACT_APP_ADMIN_EMAIL || userEmail === process.env.REACT_APP_ADMIN_EMAIL_TWO) {
    return children;
  } else {
    return (
      <section style={{ minHeight: "80vh" }}>
        <div className="container">
          <h2>PERMISSION DENIED</h2>
          <p>This page can only be viewed by an admin</p>
          <br />
          <Link to="/">
            <button className="--btn --btn-primary">&larr; Back to Home</button>
          </Link>
        </div>
      </section>
    );
  }
}

export function AdminOnlyLink({ children }) {
  const userEmail = useSelector(selectEmail);

  if (userEmail === process.env.REACT_APP_ADMIN_EMAIL) {
    return children;
  } else {
    return null;
  }
}
