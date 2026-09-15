import type { CSSProperties } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";

import ProfileMenuRow from "@/components/profile/ProfileMenuRow";
import { Button } from "@/components/ui/button";
import { PROFILE_MENU_ITEMS } from "@/lib/profile/menu-items";
import { typography } from "@/tokens/design-tokens";

type ThemeName = "dark" | "light";

function readTheme(): ThemeName {
  const savedTheme = window.localStorage.getItem("circular-theme");
  return savedTheme === "light" ? "light" : "dark";
}

function pageTitleStyle(): CSSProperties {
  return typography.headlineSmall;
}

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTheme = searchParams.get("theme");
  const theme: ThemeName =
    requestedTheme === "light" || requestedTheme === "dark"
      ? requestedTheme
      : readTheme();

  const toggleTheme = () => {
    const nextTheme: ThemeName = theme === "light" ? "dark" : "light";
    window.localStorage.setItem("circular-theme", nextTheme);
    navigate(
      { pathname: "/profile", search: `?theme=${nextTheme}` },
      { replace: true },
    );
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <section
      className="flex min-h-full w-full min-w-0 flex-col gap-4 px-4 pb-4 pt-2 tablet:px-8"
      aria-labelledby="profile-title"
    >
      <header className="flex w-full shrink-0 items-center justify-between gap-3 rounded-lg bg-secondary/40 px-4 py-3">
        <div className="size-12 shrink-0" aria-hidden />

        <h1
          id="profile-title"
          className="min-w-0 flex-1 text-center text-foreground"
          style={pageTitleStyle()}
        >
          Profile
        </h1>

        <button
          type="button"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close profile"
          onClick={() => navigate("/")}
        >
          <X aria-hidden className="size-5" strokeWidth={2} />
        </button>
      </header>

      <nav
        className="flex w-full min-w-0 flex-col gap-3"
        aria-label="Profile settings"
      >
        {PROFILE_MENU_ITEMS.map((item) => (
          <ProfileMenuRow
            key={item.id}
            label={item.label}
            icon={item.icon}
            variant={item.variant}
            to={item.path}
            onClick={item.action === "theme-toggle" ? toggleTheme : undefined}
            trailing={
              item.action === "theme-toggle"
                ? theme === "light"
                  ? "Light"
                  : "Dark"
                : undefined
            }
          />
        ))}
      </nav>

      <Button
        type="button"
        className="mobile-action mobile-action-primary mt-auto h-14 w-full shrink-0 rounded-full focus-visible:ring-offset-background"
        style={typography.button}
        onClick={handleLogout}
      >
        Log out
      </Button>
    </section>
  );
}
