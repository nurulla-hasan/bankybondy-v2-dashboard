import {
  Bell,
  CreditCard,
  FileText,
  Flag,
  LayoutDashboard,
  Link2,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  /** Translation key inside the `Nav` namespace. */
  key: string;
  href: string;
  icon: LucideIcon;
}

export interface NavigationGroup {
  /** Translation key inside the `Nav` namespace. */
  key: string;
  items: NavigationItem[];
}

export const adminNavigation: NavigationGroup[] = [
  {
    key: "sectionManagement",
    items: [
      { key: "overview", href: "/dashboard", icon: LayoutDashboard },
      { key: "users", href: "/users", icon: Users },
      { key: "bonds", href: "/bonds", icon: Link2 },
      { key: "matching", href: "/matching", icon: Sparkles },
      { key: "payments", href: "/payments", icon: CreditCard },
      { key: "content", href: "/content", icon: FileText },
      { key: "notifications", href: "/notifications", icon: Bell },
      { key: "reports", href: "/reports", icon: Flag },
    ],
  },
  {
    key: "sectionSystem",
    items: [{ key: "settings", href: "/settings", icon: Settings }],
  },
];
