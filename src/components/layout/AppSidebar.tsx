import { BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserRole } from "@/features/auth/utils/auth.utils";
import {
  adminNavigation,
  librarianNavigation,
  memberNavigation,
} from "@/data/navigation";

export function AppSidebar() {
  const role = getUserRole();

  const navigation =
    role === "Admin"
      ? adminNavigation
      : role === "Librarian"
        ? librarianNavigation
        : memberNavigation;
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex h-16 items-center justify-center border-b px-2 group-data-[collapsible=icon]:px-0">
          <BookOpen className="h-5 w-5 shrink-0" />

          <span className="ml-2 text-lg font-semibold group-data-[collapsible=icon]:hidden">
            BookFlow
          </span>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <TooltipProvider>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.path}>
                            <item.icon />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>

                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </TooltipProvider>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
