import { Outlet } from "react-router-dom";

import { darkThemeStyle } from "@/tokens/design-tokens";

import BottomNav from "./BottomNav";
import StatusBar from "./StatusBar";

export default function AppLayout() {
  return (
    <div
      className="dark flex min-h-svh items-center justify-center bg-background text-foreground"
      style={darkThemeStyle}
    >
      <div className="flex h-203 max-h-svh w-full max-w-93.75 flex-col items-center justify-between overflow-hidden bg-background">
        <StatusBar />
        <main className="flex h-165 w-full shrink-0 flex-col">
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
