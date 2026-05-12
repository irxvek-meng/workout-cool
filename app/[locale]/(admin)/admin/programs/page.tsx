import { Suspense } from "react";
import Link from "next/link";
import { getI18n } from "locales/server";

import { ProgramsList } from "@/features/admin/programs/ui/programs-list";
import { CreateProgramButton } from "@/features/admin/programs/ui/create-program-button";

interface AdminProgramsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPrograms({ params }: AdminProgramsPageProps) {
  const { locale } = await params;
  const t = await getI18n();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("admin.programs_title")}</h1>
          <p className="text-muted-foreground">{t("admin.programs_subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link className="btn btn-outline btn-sm" href={`/${locale}/admin/programs/quick`}>
            {t("admin.programs_quick_link")}
          </Link>
          <CreateProgramButton />
        </div>
      </div>

      <Suspense fallback={<div>{t("admin.programs_loading")}</div>}>
        <ProgramsList locale={locale} />
      </Suspense>
    </div>
  );
}
