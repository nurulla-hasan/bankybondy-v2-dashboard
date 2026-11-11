import {
  AudioLines,
  CircleDollarSign,
  Flag,
  Handshake,
  LayoutDashboard,
  ListOrdered,
  MapPinned,
  Settings,
  TrendingUp,
  UserCog,
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
      { key: "income", href: "/income", icon: TrendingUp },
      { key: "skills", href: "/skills", icon: ListOrdered },
      { key: "audioTopics", href: "/audio-topic", icon: CircleDollarSign },
      {
        key: "audioModeration",
        href: "/audio-moderation",
        icon: AudioLines,
      },
      { key: "heatMap", href: "/heat-map", icon: MapPinned },
      { key: "report", href: "/report", icon: Flag },
      { key: "makeAdmin", href: "/make-admin", icon: UserCog },
      { key: "users", href: "/users", icon: Users },
      { key: "donors", href: "/donors", icon: Handshake },
    ],
  },
  {
    key: "sectionSystem",
    items: [{ key: "settings", href: "/settings", icon: Settings }],
  },
];
