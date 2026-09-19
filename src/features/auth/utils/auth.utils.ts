import { jwtDecode } from "jwt-decode";

export type UserRole = "Member" | "Librarian" | "Admin";

interface JwtPayload {
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export function getUserRole(): UserRole | null {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const role =
      decoded.role ??
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === "Member" || role === "Librarian" || role === "Admin") {
      return role;
    }

    return null;
  } catch {
    return null;
  }
}

export function isAdmin() {
  return getUserRole() === "Admin";
}

export function isLibrarian() {
  return getUserRole() === "Librarian";
}

export function isMember() {
  return getUserRole() === "Member";
}
