import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { UploadedVideosProvider } from "./context/UploadedVideosContext";
import { UploadProgressProvider } from "./context/UploadProgressContext";
import { UploadProgressIndicator } from "./components/upload/UploadProgressIndicator";
import { AuthProvider } from "./hooks/useAuth";
import AppRoutes from "./routes";
import { VignetteAd } from "./components/advertising/VignetteAd";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <UploadProgressProvider>
          <UploadedVideosProvider>
            <Toaster />
            <Sonner />
            <UploadProgressIndicator />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </UploadedVideosProvider>
        </UploadProgressProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;