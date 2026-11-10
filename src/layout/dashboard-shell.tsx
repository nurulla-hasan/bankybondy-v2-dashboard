"use client";

import * as React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageWrapper } from "@/components/common/page-wrapper";
import type { Session } from "@/types";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardShellProps {
  user: Session;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader user={user} />
        <div className="flex-1">
          <PageWrapper padding="compact">{children}</PageWrapper>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardShell;
