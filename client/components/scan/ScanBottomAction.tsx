import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { typography } from "@/tokens/design-tokens";

type ScanBottomActionProps = {
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  helperText?: string;
  type?: "button" | "submit";
  form?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function ScanBottomAction({
  label,
  onClick,
  disabled = false,
  helperText,
  type = "button",
  form,
  variant = "primary",
  className,
}: ScanBottomActionProps) {
  return (
    <div className={cn("flex w-full shrink-0 flex-col gap-2", className)}>
      {helperText ? (
        <p
          className="px-1 text-center text-muted-foreground"
          style={typography.bodySmall}
        >
          {helperText}
        </p>
      ) : null}

      <Button
        type={type}
        form={form}
        disabled={disabled}
        className={cn(
          "mobile-action h-14 min-h-14 w-full shrink-0 rounded-full focus-visible:ring-offset-background",
          variant === "primary"
            ? "mobile-action-primary"
            : "mobile-action-secondary border border-secondary-button-stroke",
        )}
        style={typography.button}
        onClick={onClick}
      >
        {label}
      </Button>

      {variant === "primary" ? (
        <div className="h-8 w-full shrink-0" aria-hidden />
      ) : null}
    </div>
  );
}
