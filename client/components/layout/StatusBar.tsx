import { cn } from "@/lib/utils";
import { typography } from "@/tokens/design-tokens";

const STATUS_ASSETS = {
  camera: "/assets/status-camera.svg",
  wifi: "/assets/status-wifi.svg",
  signal: "/assets/status-signal.svg",
  battery: "/assets/status-battery.svg",
} as const;

type StatusIconProps = {
  src: string;
  className: string;
};

function StatusIcon({ src, className }: StatusIconProps) {
  return (
    <span
      aria-hidden
      className={cn("block shrink-0 bg-foreground", className)}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export default function StatusBar() {
  return (
    <div
      className="flex h-13 w-full shrink-0 items-end justify-between px-4 pb-2 text-foreground tablet:px-8"
      aria-label="Device status"
    >
      <time dateTime="09:30" style={typography.status}>
        9:30
      </time>

      <StatusIcon
        src={STATUS_ASSETS.camera}
        className="h-6 w-6"
      />

      <div className="flex h-4.25 w-15.75 items-start justify-between">
        <StatusIcon
          src={STATUS_ASSETS.wifi}
          className="h-4.25 w-4.25"
        />
        <StatusIcon
          src={STATUS_ASSETS.signal}
          className="h-4.25 w-4.25"
        />
        <StatusIcon
          src={STATUS_ASSETS.battery}
          className="mt-px h-3.75 w-2"
        />
      </div>
    </div>
  );
}
