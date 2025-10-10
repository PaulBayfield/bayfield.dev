"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PhotosCarousel from "@/components/photoscarousel";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Github, MapPin, ArrowRight } from "lucide-react";
import { useUmami } from "next-umami";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  const t = useTranslations("About");
  const th = useTranslations("Header");
  const umami = useUmami();

  return (
    <section
      id="about"
      className="scroll-mt-20 max-w-6xl mx-auto px-5 md:px-8 py-14 md:py-20"
    >
      <Card className="md:hidden border-zinc-200 dark:border-zinc-800 shadow-sm mb-10">
        <CardContent className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-zinc-200 dark:ring-zinc-800">
              <AvatarImage src="/images/avatar.png" alt="Paul Bayfield" />
              <AvatarFallback>Paul Bayfield</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-lg font-semibold tracking-tight">
                Paul Bayfield
              </p>
              <p className="text-sm text-zinc-500">
                {th("sub-title")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <motion.div
        initial="hidden"
        animate="show"
        variants={fade}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start"
      >
        <div className="md:col-span-7 gap-6 flex flex-col">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-prose">
            {t("description")}
          </p>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-prose">
            {t("description2")}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="sm" onClick={() => umami.event("About.LearnMore")}>
              <Link
                href="#experience"
                className="inline-flex items-center gap-2"
              >
                {t("learn_more")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => umami.event("About.GitHub")}
            >
              <Link
                href="https://github.com/PaulBayfield"
                className="inline-flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <MapPin className="h-4 w-4" />
              Reims, France
            </div>
          </div>
        </div>
        <PhotosCarousel />
      </motion.div>
    </section>
  );
}
