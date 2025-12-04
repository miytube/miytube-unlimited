
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { UploadedVideosProvider } from "./context/UploadedVideosContext";
import { UploadProgressProvider } from "./context/UploadProgressContext";
import AppRoutes from "./routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UploadProgressProvider>
        <UploadedVideosProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </UploadedVideosProvider>
      </UploadProgressProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
