"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useMessages, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, FolderGit2, Globe, HandHeart, Heart, ShieldUser, Sparkles, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Projects() {
  const t = useTranslations("Projects");

  const messages = useMessages();
  const keys = Object.keys(messages.Projects.list);

  return (
    <section
      id="projects"
      className="scroll-mt-20 py-10 mx-auto max-w-6xl px-5 md:px-8 pb-14 md:pb-20"
    >
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {t("title")}
        </h2>
        <Link
          href="https://github.com/PaulBayfield?tab=repositories"
          className="text-sm text-zinc-500 hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("view_all")}
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {keys.map((key, idx) => {
          const labels = Object.values(messages.Projects.list[key].tech);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card className="group h-full border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow justify-between">
                <div className="flex flex-col gap-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                      <span>{t(`list.${key}.title`)}</span>
                      <Badge variant="secondary" className="shrink-0">
                        {t(`list.${key}.year`)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src={`/images/projects/${t(`list.${key}.title`)
                        .toLowerCase()
                        .replace(/ /g, "-")}.png`}
                      alt={t(`list.${key}.title`)}
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover rounded-md mb-4 group-hover:scale-105 transition-transform"
                    />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[3.5rem]">
                      {t(`list.${key}.description`)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {labels.map((t, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="font-normal"
                        >
                          {String(t)}
                        </Badge>
                      ))}
                    </div>
                    {t(`list.${key}.superstar`) || t(`list.${key}.star`) || t(`list.${key}.role`) || t(`list.${key}.team`) ? (
                      <Separator className="mt-3 mb-1" />
                    ) : null}
                    {t(`list.${key}.superstar`) && (
                      <Badge variant="secondary" className="font-bold mt-2">
                        <Heart className="inline h-4 w-4 mr-1 text-red-600 dark:text-red-500" />
                        {t(`list.${key}.superstar`)}
                      </Badge>
                    )}
                    {t(`list.${key}.star`) && (
                      <Badge variant="secondary" className="font-semibold mt-2">
                        <Sparkles className="inline h-4 w-4 mr-1 text-yellow-500 dark:text-yellow-400" />
                        {t(`list.${key}.star`)}
                      </Badge>
                    )}
                    {t(`list.${key}.role`) && (
                      <Badge variant="secondary" className="mt-2 mr-2">
                        <ShieldUser className="inline h-4 w-4 mr-1" />
                        {t(`list.${key}.role`)}
                      </Badge>
                    )}
                    {t(`list.${key}.team`) && (
                      <Badge variant="secondary" className="mt-2">
                        <Users className="inline h-4 w-4 mr-1" />
                        {t(`list.${key}.team`)}
                      </Badge>
                    )}
                  </CardContent>
                </div>
                <div>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-zinc-500">
                      {t(`list.${key}.href`) && (
                        <span className="inline-flex items-center gap-1">
                          <FolderGit2 className="h-4 w-4" />
                          OSS
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={t(`list.${key}.href`)}
                          className="inline-flex items-center gap-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Repo
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      {t(`list.${key}.site`) && (
                        <Button size="sm" asChild>
                          <Link
                            href={t(`list.${key}.site`)}
                            className="inline-flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Site
                            <Globe className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
