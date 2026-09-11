import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import {
  darkThemeStyle,
  lightThemeStyle,
} from "@/tokens/design-tokens";

import BottomNav from "./BottomNav";
import StatusBar from "./StatusBar";

type ThemeName = "dark" | "light";

function readSavedTheme(): ThemeName {
  const savedTheme = window.localStorage.getItem("circular-theme");
  return savedTheme === "light" ? "light" : "dark";
}

export default function AppLayout() {
  const [searchParams] = useSearchParams();
  const requestedTheme = searchParams.get("theme");
  const [theme, setTheme] = useState<ThemeName>(() =>
    requestedTheme === "light" || requestedTheme === "dark"
      ? requestedTheme
      : readSavedTheme(),
  );

  useEffect(() => {
    if (requestedTheme === "light" || requestedTheme === "dark") {
      setTheme(requestedTheme);
      window.localStorage.setItem("circular-theme", requestedTheme);
    }
  }, [requestedTheme]);

  const isLightTheme = theme === "light";

  return (
    <div
      className={cn(
        "flex min-h-svh items-center justify-center bg-background text-foreground",
        isLightTheme ? "light" : "dark",
      )}
      data-theme={isLightTheme ? "light" : "dark"}
      style={isLightTheme ? lightThemeStyle : darkThemeStyle}
    >
      <div className="flex h-svh min-h-0 w-full max-w-93.75 flex-col items-center overflow-x-hidden bg-background">
        <StatusBar />
        <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
        <BottomNav />
        <div
          className="flex h-6 w-full shrink-0 items-center justify-center"
          aria-hidden
        >
          <div className="h-1 w-27.25 rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  );
}
