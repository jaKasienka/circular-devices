import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: string;
  width: number;
  height: number;
};

const NAV_ITEMS = [
  {
    to: "/",
    label: "Home",
    icon: "/assets/nav-home.svg",
    width: 27,
    height: 30,
  },
  {
    to: "/devices",
    label: "My Devices",
    icon: "/assets/nav-devices.svg",
    width: 27,
    height: 30,
  },
  {
    to: "/scan",
    label: "New Scan",
    icon: "/assets/nav-scan.svg",
    width: 21,
    height: 30,
  },
  {
    to: "/profile",
    label: "My Profile",
    icon: "/assets/nav-profile.svg",
    width: 30,
    height: 29,
  },
] satisfies readonly NavItem[];

function NavIcon({
  src,
  active,
  width,
  height,
}: Pick<NavItem, "width" | "height"> & {
  src: string;
  active: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "block overflow-clip",
        active ? "text-primary" : "text-muted-foreground",
      )}
      style={{
        width,
        height,
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-20 bg-background">
      <div className="mx-auto flex w-full max-w-85 items-center justify-between px-4 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className="flex h-12 min-w-12 flex-col items-center justify-end gap-1.75"
          >
            {({ isActive }) => (
              <>
                <NavIcon
                  src={item.icon}
                  active={isActive}
                  width={item.width}
                  height={item.height}
                />
                <span
                  className={cn(
                    "whitespace-nowrap font-sans text-[9px] font-medium",
                    isActive
                      ? "text-on-primary-container underline"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
