import { typography } from "@/tokens/design-tokens";

type ScanStatusBannerProps = {
  children: React.ReactNode;
};

export default function ScanStatusBanner({ children }: ScanStatusBannerProps) {
  return (
    <div
      className="rounded-lg bg-secondary/50 px-4 py-3 text-foreground"
      style={typography.bodySmall}
    >
      {children}
    </div>
  );
}
