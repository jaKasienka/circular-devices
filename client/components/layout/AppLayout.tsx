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

  useEffect(() => {
    const root = document.documentElement;
    const updateViewportHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      root.style.setProperty("--app-height", `${Math.round(height)}px`);
    };

    updateViewportHeight();
    window.visualViewport?.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("scroll", updateViewportHeight);
    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        updateViewportHeight,
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        updateViewportHeight,
      );
      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
    };
  }, []);

  const isLightTheme = theme === "light";

  return (
    <div
      className={cn(
        "h-full w-full bg-background text-foreground",
        isLightTheme ? "light" : "dark",
      )}
      data-theme={isLightTheme ? "light" : "dark"}
      style={isLightTheme ? lightThemeStyle : darkThemeStyle}
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-xl flex-col items-center overflow-hidden bg-background tablet:max-w-3xl">
        <StatusBar />
        <main className="flex min-h-0 w-full flex-1 flex-col overflow-auto">
          <Outlet />
        </main>
        <BottomNav />
        <div
          className="flex w-full shrink-0 flex-col items-center pb-[env(safe-area-inset-bottom,0px)]"
          aria-hidden
        >
          <div className="flex h-6 w-full items-center justify-center">
            <div className="h-1 w-27.25 rounded-full bg-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
