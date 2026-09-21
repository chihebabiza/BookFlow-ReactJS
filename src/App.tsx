import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <AppSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Header />

            <main className="flex-1 space-y-6 p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default App;
