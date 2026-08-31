"use client";

import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslation } from "@/context/LanguageContext";
import React from "react";

export default function CalendarPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageBreadcrumb pageTitle={t("Calendar")} />
      <Calendar />
    </div>
  );
}

