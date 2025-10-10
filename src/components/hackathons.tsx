"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useMessages, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Handshake,
  Hourglass,
  Trophy,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Hackathons() {
  const t = useTranslations("Hackathons");

  const messages = useMessages();
  const keys = Object.keys(messages.Hackathons.list);

  return (
    <section
      id="hackathons"
      className="scroll-mt-20 py-10 mx-auto max-w-6xl px-5 md:px-8 pb-14 md:pb-20"
    >
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {t("title")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {keys.map((key, idx) => {
          const labels = Object.values(messages.Hackathons.list[key].tech);

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
                      src={`/images/hackathons/${t(`list.${key}.title`)
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
                    {t(`list.${key}.trophy`) ||
                    t(`list.${key}.duration`) ||
                    t(`list.${key}.team`) ||
                    t(`list.${key}.sponsor`)? (
                      <Separator className="mt-3 mb-1" />
                    ) : null}
                    {t(`list.${key}.trophy`) && (
                      <Badge variant="secondary" className="font-semibold mt-2 mr-2">
                        <Trophy className="inline h-4 w-4 mr-1 text-yellow-500 dark:text-yellow-400" />
                        {t(`list.${key}.trophy`)}
                      </Badge>
                    )}
                    {t(`list.${key}.duration`) && (
                      <Badge variant="secondary" className="mt-2 mr-2">
                        <Hourglass className="inline h-4 w-4 mr-1" />
                        {t(`list.${key}.duration`)}
                      </Badge>
                    )}
                    {t(`list.${key}.team`) && (
                      <Badge variant="secondary" className="mt-2 mr-2">
                        <Users className="inline h-4 w-4 mr-1" />
                        {t(`list.${key}.team`)}
                      </Badge>
                    )}
                    {t(`list.${key}.sponsor`) && (
                      <Badge variant="secondary" className="mt-2 mr-2">
                        <Handshake className="inline h-4 w-4 mr-1" />
                        {t(`sponsor`)} {t(`list.${key}.sponsor`)}
                      </Badge>
                    )}
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
