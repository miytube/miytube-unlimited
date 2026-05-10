import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const PREVIEW_KEY = "miytube:vignette:preview";

/**
 * Admin-only floating button to toggle a vignette ad preview on the current
 * session. Lets you QA wallpaper takeovers without paying for a real campaign.
 */
export const VignettePreviewToggle = () => {
  const { isAdmin } = useAuth();
  const [active, setActive] = useState(
    typeof window !== "undefined" && sessionStorage.getItem(PREVIEW_KEY) === "1"
  );

  useEffect(() => {
    // Notify VignetteAd to re-evaluate
    window.dispatchEvent(new Event("vignette-preview-change"));
  }, [active]);

  if (!isAdmin) return null;

  const toggle = () => {
    if (active) {
      sessionStorage.removeItem(PREVIEW_KEY);
      // Also clear cached chosen ad + impression count so next toggle is fresh
      sessionStorage.removeItem("miytube:vignette:current");
      sessionStorage.removeItem("miytube:vignette:impressions");
      setActive(false);
    } else {
      sessionStorage.setItem(PREVIEW_KEY, "1");
      sessionStorage.removeItem("miytube:vignette:current");
      sessionStorage.removeItem("miytube:vignette:impressions");
      setActive(true);
    }
  };

  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={toggle}
      className="fixed bottom-6 right-44 z-50 shadow-lg rounded-full h-12 px-4 gap-2"
      aria-label="Toggle vignette ad preview"
    >
      {active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      {active ? "Stop Vignette Preview" : "Preview Vignette"}
    </Button>
  );
};

export default VignettePreviewToggle;
