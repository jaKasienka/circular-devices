import { NavLink } from "react-router-dom";

import IconBadge, { MaskedIcon } from "@/components/ui/icon-badge";
import { deviceFreshScanPath } from "@/lib/devices/device-navigation";
import { cn } from "@/lib/utils";
import { typography } from "@/tokens/design-tokens";

type NavItem = {
  to: string;
  label: string;
  icon: string;
};

const NAV_ITEMS = [
  {
    to: "/",
    label: "Home",
    icon: "/assets/nav-home.svg",
  },
  {
    to: "/devices",
    label: "My Devices",
    icon: "/assets/nav-devices.svg",
  },
  {
    to: deviceFreshScanPath(),
    label: "New Scan",
    icon: "/assets/nav-scan.svg",
  },
  {
    to: "/profile",
    label: "My Profile",
    icon: "/assets/nav-profile.svg",
  },
] satisfies readonly NavItem[];

export default function BottomNav() {
  return (
    <nav
      className="mt-2 h-16 w-full shrink-0 bg-background"
      aria-label="Primary"
    >
      <div className="mx-auto flex h-full w-full max-w-full items-center justify-between gap-1 px-2 py-2 min-[360px]:px-4 tablet:px-8">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "relative flex min-h-12 min-w-0 flex-1 flex-col items-center justify-between gap-0.5 py-0.5 touch-manipulation transition-transform duration-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                isActive && "-translate-y-1",
              )
            }
          >
            {({ isActive }) => (
              <>
                <IconBadge variant={isActive ? "active" : "muted"}>
                  <MaskedIcon src={item.icon} />
                </IconBadge>
                <span
                  className={cn(
                    "max-w-full shrink-0 truncate text-center",
                    isActive
                      ? "text-bottom-bar-selected"
                      : "text-bottom-bar",
                  )}
                  style={typography.navigation}
                >
                  {item.label}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1 h-1 w-1 rounded-full bg-bottom-bar-selected transition-[opacity,transform] duration-200 motion-reduce:transition-none",
                    isActive
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0",
                  )}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
