import { Metadata } from "next";
import { Locale } from "locales/types";
import { getI18n } from "locales/server";

import { ExerciseLibraryPage } from "@/exercise-library-app/features/exercise-library/ui/exercise-library-page";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  await params;
  const t = await getI18n();

  return {
    title: t("exercise_library.meta_title"),
    description: t("exercise_library.meta_description"),
  };
}

export default async function ExerciseLibraryRoutePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getI18n();

  const breadcrumbItems = [
    {
      label: t("breadcrumbs.home"),
      href: `/${locale}`,
    },
    {
      label: t("exercise_library.page_title"),
      current: true,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <ExerciseLibraryPage locale={locale} />
    </>
  );
}
