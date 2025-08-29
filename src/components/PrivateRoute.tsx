import React, { type JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { type RootState } from "../redux/store";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const userId = useSelector((state: RootState) => state.user.id);

  if (!userId) {
    return <Navigate to="/login" replace />; //redirect to login if no user is authenticated
  }
  //render protected page
  return children;
};

export default PrivateRoute;
