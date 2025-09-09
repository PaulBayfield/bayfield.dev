"use client";

import ModeToggle from "@/components/theme-switcher";
import LocaleToggle from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useScrollSpy } from "@/hooks/scroll-spy";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  SquareUserRound,
  BriefcaseBusiness,
  FolderCode,
  Database,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

export default function Header() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 850px)");

  const t = useTranslations("Header");

  const activeSection = useScrollSpy(
    ["about", "experience", "projects", "data"],
    150
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-zinc-950/50 bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-zinc-200 dark:ring-zinc-800">
              <AvatarImage src="/images/avatar.png" alt="Paul Bayfield" />
              <AvatarFallback>Paul Bayfield</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="hidden sm:flex text-lg font-semibold tracking-tight">
                Paul Bayfield
              </p>
              <p className="hidden sm:flex text-sm text-zinc-500">
                {t("sub-title")}
              </p>
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          <Button
            size={isDesktop ? "sm" : "icon"}
            asChild
            variant={
              pathname === "/" && activeSection === "about"
                ? "selected"
                : "outline"
            }
            className="select-none"
          >
            <Link href="/#about">
              {isDesktop ? t("about") : <SquareUserRound className="h-6 w-6" />}
            </Link>
          </Button>
          <Button
            size={isDesktop ? "sm" : "icon"}
            asChild
            variant={
              pathname === "/" && activeSection === "experience"
                ? "selected"
                : "outline"
            }
            className="select-none"
          >
            <Link href="/#experience">
              {isDesktop ? (
                t("experience")
              ) : (
                <BriefcaseBusiness className="h-6 w-6" />
              )}
            </Link>
          </Button>
          <Button
            size={isDesktop ? "sm" : "icon"}
            asChild
            variant={
              pathname === "/" && activeSection === "projects"
                ? "selected"
                : "outline"
            }
            className="select-none"
          >
            <Link href="/#projects">
              {isDesktop ? t("projects") : <FolderCode className="h-6 w-6" />}
            </Link>
          </Button>
          <Button
            size={isDesktop ? "sm" : "icon"}
            asChild
            variant={
              pathname === "/" && activeSection === "data"
                ? "selected"
                : "outline"
            }
            className="select-none"
          >
            <Link href="/#data">
              {isDesktop ? t("data") : <Database className="h-6 w-6" />}
            </Link>
          </Button>
          <ModeToggle />
          <LocaleToggle />
        </nav>
      </div>
    </header>
  );
}
