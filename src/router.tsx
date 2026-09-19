import { createBrowserRouter } from "react-router-dom";

import App from "./App";

import { Books } from "@/features/books/pages/Books";
import { Dashboard } from "./features/dashboard/pages/Dashboard";
import { Authors } from "@/features/authors/pages/Authors";
import { Categories } from "@/features/categories/pages/Categories";
import { Members } from "@/features/members/pages/Members";
import { MemberLoans } from "@/features/loans/pages/MemberLoans";
import { Users } from "@/features/users/pages/Users";
import Login from "./features/auth/pages/Login";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { AdminRoute } from "./features/auth/components/AdminRoute";
import { LibrarianRoute } from "./features/auth/components/LibrarianRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },

          {
            path: "books",
            element: <Books />,
          },

          {
            path: "authors",
            element: <Authors />,
          },

          {
            path: "categories",
            element: <Categories />,
          },

          {
            element: <AdminRoute />,
            children: [
              {
                path: "users",
                element: <Users />,
              },
            ],
          },

          {
            element: <LibrarianRoute />,
            children: [
              {
                path: "members",
                element: <Members />,
              },
              {
                path: "loans",
                element: <MemberLoans />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
