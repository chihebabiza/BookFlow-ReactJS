import { Navigate, Outlet } from "react-router-dom";
import { isAdmin, isLibrarian } from "@/features/auth/utils/auth.utils";

export function LibrarianRoute() {
  if (!isLibrarian() && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
