import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import type { ReactNode } from "react";

import { AdminSidebar } from "@/features/admin/layout/admin-sidebar/ui/admin-sidebar";
import { AdminHeader } from "@/features/admin/layout/admin-sidebar/ui/admin-header";
import { serverAuth } from "@/entities/user/model/get-server-session-user";

interface AdminLayoutProps {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;
  const user = await serverAuth();

  if (!user) {
    const redirectTo = encodeURIComponent(`/${locale}/admin/dashboard`);
    redirect(`/${locale}/auth/signin?redirect=${redirectTo}`);
  }

  if (user.role !== UserRole.admin) {
    redirect(`/${locale}`);
  }

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader user={user} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-white p-6 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
