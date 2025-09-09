"use client";

import React from "react";
import Timeline from "@/components/timeline";
import { useTranslations } from "next-intl";

export default function Experience() {
  const t = useTranslations("Experience");

  return (
    <section
      id="experience"
      className="scroll-mt-20 py-10 mx-auto max-w-6xl px-5 md:px-8 pb-14 md:pb-20"
    >
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {t("title")}
      </h2>
      <Timeline />
    </section>
  );
}
