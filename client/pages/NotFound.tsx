import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { typography } from "@/tokens/design-tokens";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex h-full min-h-96 flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-foreground" style={typography.displaySmall}>
        404
      </h1>
      <p className="text-muted-foreground" style={typography.bodyMedium}>
        Oops! Page not found
      </p>
      <Button
        asChild
        className="mobile-action mobile-action-primary rounded-full px-6"
        style={typography.button}
      >
        <Link to="/">RETURN HOME</Link>
      </Button>
    </div>
  );
};

export default NotFound;
