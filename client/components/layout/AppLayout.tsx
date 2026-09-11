import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="dark flex min-h-svh flex-col bg-background font-sans text-foreground">
      <main className="mx-auto flex w-full max-w-[375px] flex-1 flex-col">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
