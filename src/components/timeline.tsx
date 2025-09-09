"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations, useMessages } from "next-intl";
import { motion } from "framer-motion";

export default function Timeline() {
  const t = useTranslations("Experience");

  const messages = useMessages();
  const keys = Object.keys(messages.Experience.list);

  return (
    <div className="relative w-full overflow-x-auto mt-10">
      <div className="flex space-x-12 pb-8 min-w-max">
        {keys.map((key, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="flex items-center">
              <div
                className={`h-4 w-4 rounded-full border-2 ${t(
                  `list.${key}.color`
                )} z-10`}
              />
            </div>
            <div className="absolute top-2 left-1/2 w-[calc(100%+3rem)] h-[2px] bg-muted-foreground/20 -translate-x-1/2" />
            <div className="mt-6 w-56">
              <div className="flex items-center justify-center pl-1.5">
                <Badge variant="outline" className={`mb-2 text-xs px-2 py-1`}>
                  {t(`list.${key}.period`)}
                </Badge>
                {t(`list.${key}.period`).startsWith("Since") ||
                t(`list.${key}.period`).startsWith("Depuis") ? (
                  <div className="relative">
                    <div className="absolute size-2 rounded-full bg-zinc-400 dark:bg-zinc-400 -translate-y-5 -translate-x-1.5" />
                    <div className="absolute size-3 rounded-full bg-zinc-500 dark:bg-zinc-300 -translate-y-5.5 -translate-x-2 animate-scan" />
                  </div>
                ) : null}
              </div>
              <h3 className="text-lg font-semibold">
                {t(`list.${key}.title`)}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                {t(`list.${key}.institution`)}
                {t(`list.${key}.location`)
                  ? ` — ${t(`list.${key}.location`)}`
                  : ""}
              </p>
              {t(`list.${key}.description`) && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(`list.${key}.description`)}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
