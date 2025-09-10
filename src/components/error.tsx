"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CircleAlert } from "lucide-react";
import { useUmami } from "next-umami";

interface ErrorPageProps {
  statusCode: number;
}

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  const t = useTranslations("ErrorPage");
  const umami = useUmami();

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 md:px-6 h-90svh">
      <CircleAlert className="h-20 w-20 text-gray-500 dark:text-gray-400" />
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
        {t(statusCode.toString() + ".title")}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
        {t(statusCode.toString() + ".description")}
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Button asChild onClick={() => umami.event(`Error.${statusCode}.Home`)}>
          <Link href="/">{t(statusCode.toString() + ".home")}</Link>
        </Button>
        <Button
          asChild
          variant="secondary"
          onClick={() => umami.event(`Error.${statusCode}.Report`)}
        >
          <Link href="/contact">{t(statusCode.toString() + ".report")}</Link>
        </Button>
      </div>
    </div>
  );
}
