
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  title?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  transparent?: boolean;
  onMenuClick?: () => void;
}

const Navbar = ({
  title,
  showBackButton = false,
  showMenuButton = false,
  transparent = false,
  onMenuClick
}: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Check if we're on a lounge details page
    if (location.pathname.startsWith('/lounges/')) {
      // Navigate to airport selection page when back is pressed from lounges page
      navigate("/airport-select");
    } else if (location.pathname === "/airport-select") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-10 h-16 px-4 flex items-center justify-between transition-all duration-300",
        transparent ? "bg-transparent" : "bg-background/80 backdrop-blur-md border-b"
      )}
    >
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {title && (
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-medium">
          {title}
        </h1>
      )}
      
      {showMenuButton && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full ml-auto"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default Navbar;
