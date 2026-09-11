import { typography } from "@/tokens/design-tokens";

const STATUS_ASSETS = {
  camera: "/assets/status-camera.svg",
  wifi: "/assets/status-wifi.svg",
  signal: "/assets/status-signal.svg",
  battery: "/assets/status-battery.svg",
} as const;

export default function StatusBar() {
  return (
    <div
      className="flex h-13 w-full shrink-0 items-end justify-between px-4 pb-2 text-foreground"
      aria-label="Device status"
    >
      <time dateTime="09:30" style={typography.status}>
        9:30
      </time>

      <img
        src={STATUS_ASSETS.camera}
        alt=""
        className="h-6 w-6"
        width={24}
        height={24}
      />

      <div className="flex h-4.25 w-15.75 items-start justify-between">
        <img
          src={STATUS_ASSETS.wifi}
          alt=""
          className="h-4.25 w-4.25"
          width={17}
          height={17}
        />
        <img
          src={STATUS_ASSETS.signal}
          alt=""
          className="h-4.25 w-4.25"
          width={17}
          height={17}
        />
        <img
          src={STATUS_ASSETS.battery}
          alt=""
          className="mt-px h-3.75 w-2"
          width={8}
          height={15}
        />
      </div>
    </div>
  );
}
