import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStats } from "@/services/umami-service";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Github, Linkedin, Mail } from "lucide-react";

const links = {
  github: "https://github.com/PaulBayfield",
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
        <span className="hidden lg:inline">{label}</span>
      </Link>
    </Button>
  );
}

export default async function Footer() {
  const t = await getTranslations("Footer");

  const stats = await getStats();

  const locale = await getLocale();
  let localeString = "fr-FR";
  if (locale === "en") {
    localeString = "en-GB";
  }

  return (
    <footer className="mx-auto max-w-6xl pb-10 w-full text-sm text-zinc-700 dark:text-zinc-300 flex flex-col md:flex-col gap-10 px-5 md:px-8">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-zinc-200 dark:ring-zinc-800">
                <AvatarImage src="/images/avatar.png" alt="Paul Bayfield" />
                <AvatarFallback>Paul Bayfield</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">bayfield.dev</h1>
            </Link>
            <Link
              href="https://github.com/PaulBayfield/bayfield.dev"
              className="flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge variant="outline" className="animate-appear text-xs">
                v{process.env.VERSION}
              </Badge>
            </Link>
          </div>
          <div className="flex flex-row mt-4 gap-2 h-full items-start">
            <div className="mt-4 flex items-center gap-3">
              <IconLink href={links.github} icon={Github} label="GitHub" />
              <IconLink
                href={links.linkedin}
                icon={Linkedin}
                label="LinkedIn"
              />
              <IconLink href={links.email} icon={Mail} label="Email" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-10 mt-4 md:mt-0">
          <div>
            <h2 className="text-md font-bold opacity-80">
              {t("links.website.title")}
            </h2>
            <ul className="mt-4 font-normal opacity-70">
              <li>
                <Link href="/#about" className="hover:underline">
                  {t("links.website.about")}
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:underline">
                  {t("links.website.experience")}
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:underline">
                  {t("links.website.projects")}
                </Link>
              </li>
              <li>
                <Link href="/#data" className="hover:underline">
                  {t("links.website.data")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-md font-bold opacity-80">
              {t("links.projects.title")}
            </h2>
            <ul className="mt-4 font-normal opacity-70">
              <li>
                <Link
                  href="https://croustillant.menu"
                  className="hover:underline"
                  target="_blank"
                >
                  {t("links.projects.croustillant")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://betteriutrcc.bayfield.dev"
                  className="hover:underline"
                  target="_blank"
                >
                  {t("links.projects.betteriutrcc")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://airfrance.bayfield.dev"
                  className="hover:underline"
                  target="_blank"
                >
                  {t("links.projects.intheair")}
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  {t("links.projects.bayfield-dev")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-md font-bold opacity-80">
              {t("links.services.title")}
            </h2>
            <ul className="mt-4 font-normal opacity-70">
              <li>
                <Link
                  href="https://github.com/PaulBayfield/bayfield.dev"
                  className="hover:underline"
                  target="_blank"
                >
                  {t("links.services.github")}
                </Link>
              </li>
              <li>
                <Link
                  href="https://uptime.bayfield.dev/status/bayfield-dev"
                  className="hover:underline"
                  target="_blank"
                >
                  {t("links.services.status")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="opacity-70 mt-4 font-normal">
        <p className="">{t("description")}</p>
        {stats.success && (
          <p className="mt-2">
            {t.rich("visits", {
              strong: (chunks) => <strong>{chunks}</strong>,
              visitors: (stats.data.visitors ?? 0).toLocaleString(
                localeString
              ),
              pageviews: (Math.max(0, Math.floor(Number(stats.data.pageviews) || 0)) ?? 0).toLocaleString(
                localeString
              ),
            })}
          </p>
        )}
        <p className="mt-2 font-semibold text-xs">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
