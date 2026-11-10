"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { adminNavigation } from "@/constants";
import { successToast } from "@/lib/toast";
import { useLogout } from "@/services";

export function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const isItemActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b px-4 flex flex-row items-center justify-center">
        <Logo size="md" href="/dashboard" />
      </SidebarHeader>

      <SidebarContent>
        {adminNavigation.map((group) => (
          <SidebarGroup key={group.key}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              {t(group.key)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      size="md"
                      isActive={isItemActive(item.href)}
                      tooltip={t(item.key)}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{t(item.key)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <Button
          variant="outline"
          onClick={() =>
            logout(undefined, {
              onSuccess: () => successToast(t("signOut")),
            })
          }
          loading={isLoggingOut}
          className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <LogOut />
          <span className="group-data-[collapsible=icon]:hidden">
            {t("signOut")}
          </span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default DashboardSidebar;
