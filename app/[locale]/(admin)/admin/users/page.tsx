import { redirect } from "next/navigation";
import { getI18n } from "locales/server";
import { UserRole } from "@prisma/client";


import { UsersTable } from "@/features/admin/users/list/ui/users-table";
import { getUsersAction } from "@/entities/user/model/get-users.actions";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

interface AdminUsersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminUsersPage({ params }: AdminUsersPageProps) {
  const { locale } = await params;
  const t = await getI18n();

  try {
    const user = await serverRequiredUser();

    if (user.role !== UserRole.admin) {
      redirect(`/${locale}`);
    }

    const result = await getUsersAction({
      page: 1,
      limit: 10,
    });

    if (!result || !result.data) {
      throw new Error(t("admin.users_error_message"));
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("admin.users_title")}</h1>
          <p className="text-muted-foreground">{t("admin.users_subtitle")}</p>
        </div>
        <UsersTable initialUsers={result} />
      </div>
    );
  } catch (error) {
    console.error("Error in admin users page:", error);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("admin.users_title")}</h1>
          <p className="text-muted-foreground">{t("admin.users_subtitle")}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">{t("admin.users_error_title")}</h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{t("admin.users_error_message")}</p>
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : t("admin.users_error_unknown")}
          </p>
        </div>
      </div>
    );
  }
}
