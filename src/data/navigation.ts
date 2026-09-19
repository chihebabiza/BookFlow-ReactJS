import { BookOpen, Home, Users } from "lucide-react";

const commonNavigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    title: "Books",
    path: "/books",
    icon: BookOpen,
  },
  {
    title: "Authors",
    path: "/authors",
    icon: Users,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: BookOpen,
  },
];

const memberNavigation = [...commonNavigation];

const librarianNavigation = [
  ...memberNavigation,
  {
    title: "Members",
    path: "/members",
    icon: Users,
  },
];

const adminNavigation = [
  ...librarianNavigation,
  {
    title: "Users",
    path: "/users",
    icon: Users,
  },
];

export { memberNavigation, librarianNavigation, adminNavigation };
