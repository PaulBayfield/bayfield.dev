import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
  };
}

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 md:px-6 h-90svh">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-center md:text-2xl text-xl font-bold text-wrap">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">{t("description")}</p>
          <div className="space-y-4">
            <Button
              asChild
              variant="default"
              className="w-full"
            >
              <Link href="mailto:paul@bayfield.dev">{t("methods.email")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link
                href="https://github.com/PaulBayfield/bayfield.dev/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wrap text-center"
              >
                {t("methods.github")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 text-center text-sm text-gray-500">
        {t("footer")}
      </div>
    </div>
  );
}
