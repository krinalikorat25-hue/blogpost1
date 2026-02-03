import { Navigate, Outlet } from "react-router-dom";
import Rootlayout from "../Pages/Rootlayout";

export default function AuthGuard() {
  const loginData = localStorage.getItem("logindata");

  if (!loginData) {
    return <Navigate to="/Login" replace />;
  }

  return (
    <Rootlayout>
      <Outlet />
    </Rootlayout>
  );
}