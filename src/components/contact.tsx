"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const links = {
  linkedin: "https://www.linkedin.com/in/paulbayfield/",
  email: "mailto:paul@bayfield.dev",
};

function IconLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Button variant="outline" size="sm" asChild className="gap-2">
      <Link
        href={href}
        aria-label={label}
        title={label}
        className="inline-flex items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon className="h-4 w-4" />
        <span className="lg:inline">{label}</span>
      </Link>
    </Button>
  );
}

export default function Contact() {
  const t = useTranslations("Contact");

  return (
    <section
      id="contact"
      className="scroll-mt-20 py-10 mx-auto max-w-6xl px-5 md:px-8 pb-14 md:pb-20"
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={fade}
        className="flex flex-col items-center justify-center text-center"
      >
        <Card className="flex flex-col gap-6 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <h3 className="text-2xl font-semibold tracking-tight leading-tight">
              {t("title")}
            </h3>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-prose">
              {t("description")}
            </p>
            <p className="mt-4 text-zinc-600 font-semibold dark:text-zinc-400 max-w-prose">
              {t("description2")}
            </p>
            <div className="mt-4 flex items-center gap-3 flex-wrap justify-center">
              <IconLink href={links.email} icon={Mail} label="Email" />
              <IconLink
                href={links.linkedin}
                icon={Linkedin}
                label="LinkedIn"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
