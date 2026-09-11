import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center font-sans">
      <h1 className="font-display text-5xl text-foreground">404</h1>
      <p className="text-lg text-muted-foreground">Oops! Page not found</p>
      <Link
        to="/"
        className="rounded-full bg-primary px-6 py-3 font-heading text-sm font-semibold tracking-[1px] text-primary-foreground transition hover:opacity-90"
      >
        RETURN HOME
      </Link>
    </div>
  );
};

export default NotFound;
