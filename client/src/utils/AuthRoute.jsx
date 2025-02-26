import { useSelector } from "react-redux";
import { selectToken } from "../store/features/authSlice";
import propTypes from "prop-types";
import { Navigate } from "react-router-dom";
const AuthRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectToken);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};
AuthRoute.propTypes = {
  children: propTypes.node.isRequired,
};

export default AuthRoute;
