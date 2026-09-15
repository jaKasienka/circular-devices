import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  Bell,
  SunMoon,
  Files,
  MapPinHouse,
  Settings,
  Wallet,
} from "lucide-react";

export type ProfileMenuVariant = "filled" | "outline";

export type ProfileMenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  variant: ProfileMenuVariant;
  path?: string;
  action?: "theme-toggle";
  description?: string;
};

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    id: "address",
    label: "Address",
    icon: MapPinHouse,
    variant: "filled",
    path: "/profile/address",
    description: "Shipping and pickup address for device returns.",
  },
  {
    id: "payment",
    label: "Payment",
    icon: Wallet,
    variant: "filled",
    path: "/profile/payment",
    description: "Payout method and recycling payment details.",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    variant: "filled",
    path: "/profile/notifications",
    description: "Alerts for scan progress, shipment, and payout updates.",
  },
  {
    id: "files",
    label: "File Settings / All Files",
    icon: Files,
    variant: "filled",
    path: "/profile/files",
    description: "Certificates, audit videos, and exported device files.",
  },
  {
    id: "account",
    label: "Account Settings",
    icon: Settings,
    variant: "outline",
    path: "/profile/account",
    description: "Login, security, and account preferences.",
  },
  {
    id: "accessibility",
    label: "Accessibility / Language",
    icon: Accessibility,
    variant: "outline",
    path: "/profile/accessibility",
    description: "Language, text size, and accessibility options.",
  },
  {
    id: "theme",
    label: "Dark / Light Mode",
    icon: SunMoon,
    variant: "outline",
    action: "theme-toggle",
  },
];

export function getProfileMenuItem(id: string): ProfileMenuItem | undefined {
  return PROFILE_MENU_ITEMS.find((item) => item.id === id);
}
