"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, LayoutDashboard, BarChart3, Settings, Sparkles } from "lucide-react";
import { useCurrentLocale, useI18n, type TFunction } from "locales/client";

import version from "../../../../../../package.json";

import { cn } from "@/shared/lib/utils";

type AdminNavTitleKey = Extract<Parameters<TFunction>[0], `admin.nav_${string}`>;
type AdminNavDescKey = Extract<Parameters<TFunction>[0], `admin.nav_${string}_desc`>;

interface NavItemConfig {
  id: string;
  href: string;
  icon: typeof LayoutDashboard;
  titleKey: AdminNavTitleKey;
  descKey: AdminNavDescKey;
  isActive?: (pathname: string) => boolean;
}

const NAV_CONFIG: NavItemConfig[] = [
  {
    id: "dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    titleKey: "admin.nav_dashboard",
    descKey: "admin.nav_dashboard_desc",
  },
  {
    id: "users",
    href: "/admin/users",
    icon: Users,
    titleKey: "admin.nav_users",
    descKey: "admin.nav_users_desc",
  },
  {
    id: "programs",
    href: "/admin/programs",
    icon: BarChart3,
    titleKey: "admin.nav_programs",
    descKey: "admin.nav_programs_desc",
    isActive: (pathname) =>
      pathname === "/admin/programs" || (pathname.startsWith("/admin/programs/") && !pathname.startsWith("/admin/programs/quick")),
  },
  {
    id: "quick",
    href: "/admin/programs/quick",
    icon: Sparkles,
    titleKey: "admin.nav_quick_create",
    descKey: "admin.nav_quick_create_desc",
    isActive: (pathname) => pathname.startsWith("/admin/programs/quick"),
  },
  {
    id: "settings",
    href: "/admin/settings",
    icon: Settings,
    titleKey: "admin.nav_settings",
    descKey: "admin.nav_settings_desc",
  },
];

function stripLocalePrefix(pathname: string, locale: string) {
  const prefix = `/${locale}`;
  if (pathname.startsWith(prefix)) {
    return pathname.slice(prefix.length) || "/";
  }

  return pathname;
}

export const AdminSidebar = () => {
  const pathname = usePathname();
  const t = useI18n();
  const locale = useCurrentLocale();

  const normalizedPath = useMemo(() => stripLocalePrefix(pathname, locale), [pathname, locale]);

  return (
    <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-1 flex-col pt-6">
        <nav className="flex-1 space-y-2 px-4">
          <div className="mb-6">
            <h2 className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("admin.nav_section")}</h2>
          </div>

          {NAV_CONFIG.map((item) => {
            const href = `/${locale}${item.href}`;
            const isActive = item.isActive
              ? item.isActive(normalizedPath)
              : normalizedPath === item.href || normalizedPath.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                className={cn(
                  "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                )}
                href={href}
                key={item.id}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300",
                  )}
                />
                <div className="flex flex-col">
                  <span>{t(item.titleKey)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t(item.descKey)}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>{t("admin.footer_title")}</p>
            <p className="mt-1">
              {t("admin.footer_version_label")} {version.version}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
