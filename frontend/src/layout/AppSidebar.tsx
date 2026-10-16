"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/LanguageContext";
import { useBranding } from "@/context/BrandingContext";
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  LockIcon,
} from "../icons/index";

const SearchNavIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z" />
  </svg>
);

const BookmarkNavIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  adminOnly?: boolean;
};

const CORE_NAV_ITEMS: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <SearchNavIcon />,
    name: "Candidate Search",
    path: "/search",
  },
  {
    icon: <BookmarkNavIcon />,
    name: "Bookmarks",
    path: "/profile/bookmarks",
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
];

const SYSTEM_NAV_ITEMS: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Statistics",
    path: "/statistics",
    adminOnly: true,
  },
  {
    icon: <LockIcon />,
    name: "Management",
    adminOnly: true,
    subItems: [
      { name: "Users", path: "/users", pro: false },
      { name: "Access Codes", path: "/access-codes", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();
  const { isRTL, t } = useLanguage();
  const { siteName, logoUrl, siteTagline } = useBranding();
  const pathname = usePathname();

  const isSuperUser = Boolean((user as any)?.is_superuser);
  const siteSettingEnabled =
    String(
      process.env.NEXT_PUBLIC_SITE_SETTING ??
      process.env.site_setting ??
      "true"
    ).toLowerCase() === "true";

  const isAdmin = Boolean(user?.is_staff || isSuperUser);

  const coreNavItems = CORE_NAV_ITEMS;

  const systemNavItems = SYSTEM_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
    if (item.name === "Management" && item.subItems) {
      const filteredSubItems = item.subItems.filter((sub) => {
        if (sub.path === "/site-settings") {
          return siteSettingEnabled && isSuperUser;
        }
        return true;
      });

      // Add Site Settings if enabled and superuser and not yet present
      const hasSiteSettings = filteredSubItems.some((sub) => sub.path === "/site-settings");
      if (siteSettingEnabled && isSuperUser && !hasSiteSettings) {
        return {
          ...item,
          subItems: [
            ...filteredSubItems,
            { name: "Site Settings", path: "/site-settings", pro: false },
          ],
        };
      }
      return {
        ...item,
        subItems: filteredSubItems,
      };
    }
    return item;
  });

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "core" | "system";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const renderMenuItems = (
    items: NavItem[],
    menuType: "core" | "system"
  ) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text font-medium">{t(nav.name)}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`${isRTL ? "mr-auto" : "ml-auto"} w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-[var(--color-primary)]"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text font-medium">{t(nav.name)}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className={`mt-1.5 space-y-1 ${isRTL ? "mr-8" : "ml-8"}`}>
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {t(subItem.name)}
                      <span className={`flex items-center gap-1 ${isRTL ? "mr-auto" : "ml-auto"}`}>
                        {subItem.new && (
                          <span
                            className={`${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    let submenuMatched = false;
    const menuGroups: { type: "core" | "system"; items: NavItem[] }[] = [
      { type: "core", items: coreNavItems },
      { type: "system", items: systemNavItems },
    ];

    menuGroups.forEach(({ type, items }) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "core" | "system") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const sidebarPos = isRTL
    ? `right-0 border-l-[1.5px] border-slate-300 dark:border-gray-800 ${
        isMobileOpen ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0`
    : `left-0 border-r-[1.5px] border-slate-300 dark:border-gray-800 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 bg-white dark:bg-gray-900 text-slate-800 dark:text-gray-100 h-screen transition-all duration-300 ease-in-out z-50 shadow-xs ${sidebarPos} 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-6 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-9 w-auto max-w-[150px] object-contain rounded-lg" />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white shadow-sm shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          )}
          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight truncate max-w-[180px]">
                {siteName}
              </span>
              <span className="text-[10px] text-[var(--color-primary)] dark:text-brand-400 font-semibold">
                {siteTagline ? t(siteTagline) : t("Matchmaking Portal")}
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1 pb-6">
        <nav className="space-y-4">
          {/* Core Navigation Group */}
          <div>
            <h2
              className={`mb-2.5 text-[11px] font-bold tracking-wider uppercase flex leading-[20px] text-slate-400 dark:text-gray-500 px-3 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                t("Menu")
              ) : (
                <HorizontaLDots />
              )}
            </h2>
            {renderMenuItems(coreNavItems, "core")}
          </div>

          {/* System & Management Group (Admins & Staff only) */}
          {systemNavItems.length > 0 && (
            <>
              {/* Divider between Core and System sections */}
              <div className="my-2 border-t border-slate-200/80 dark:border-gray-800" />

              <div>
                <h2
                  className={`mb-2.5 text-[11px] font-bold tracking-wider uppercase flex leading-[20px] text-slate-400 dark:text-gray-500 px-3 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    t("System & Management")
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(systemNavItems, "system")}
              </div>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;