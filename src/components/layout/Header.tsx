import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/context/useTheme";
import { logout } from "@/features/auth/api/auth.api";
import type { LogoutRequest } from "@/features/auth/types/auth";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const email = localStorage.getItem("email");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!email || !refreshToken) {
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      const data: LogoutRequest = {
        email,
        refreshToken,
      };

      await logout(data);

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("email");

      navigate("/login");
    }
  };

  return (
    <header className="flex h-16 items-center border-b px-4 md:px-6">
      <SidebarTrigger />

      <div className="ml-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0"
            >
              <Avatar>
                <AvatarFallback>CH</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Chiheb</span>

                <span className="text-xs text-muted-foreground">
                  chiheb@example.com
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
