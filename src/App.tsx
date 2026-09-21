import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <AppSidebar />
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              classNames: {
                success: "bg-green-600 text-white border-green-600",
              },
            }}
          />

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
