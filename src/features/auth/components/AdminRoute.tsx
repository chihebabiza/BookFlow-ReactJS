import { Navigate, Outlet } from "react-router-dom";
import { isAdmin } from "@/features/auth/utils/auth.utils";

export function AdminRoute() {
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
