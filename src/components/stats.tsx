"use server";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  HardDrive,
  MemoryStick,
  Wifi,
  Globe,
  Building2,
  Camera,
  Video,
  MousePointer2Icon,
  UserRound,
  Music,
  Clock,
  Hourglass,
  FileCode,
  Code,
  Info,
  Save,
} from "lucide-react";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { AnimatedSection } from "@/components/animated-section";
import {
  ApiResult,
  DashCodeSummary,
  DashGpsSummary,
  DashMusicSummary,
  DashPhotosSummary,
  InfrastructureStats,
} from "@/services/types";

export default async function Stats({
  infrastructureStats,
  codeStats,
  musicStats,
  gpsStats,
  photosStats,
}: {
  infrastructureStats: ApiResult<InfrastructureStats>;
  codeStats: ApiResult<DashCodeSummary>;
  musicStats: ApiResult<DashMusicSummary>;
  gpsStats: ApiResult<DashGpsSummary>;
  photosStats: ApiResult<DashPhotosSummary>;
}) {
  const t = await getTranslations("Stats");

  const infra = infrastructureStats.success ? infrastructureStats.data : null;
  const code = codeStats.success ? codeStats.data : null;
  const music = musicStats.success ? musicStats.data : null;
  const gps = gpsStats.success ? gpsStats.data : null;
  const photos = photosStats.success ? photosStats.data : null;

  const locale = await getLocale();
  let localeString = "fr-FR";
  if (locale === "en") {
    localeString = "en-GB";
  }

  return (
    <section
      id="data"
      className="scroll-mt-20 py-12 mx-auto max-w-6xl px-5 md:px-8 pb-14 md:pb-20"
    >
      <AnimatedSection className="grid grid-cols-1 md:grid-cols-8 gap-6 md:gap-10 items-start">
        <div className="md:col-span-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            {t("title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("description")}
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
            {t("source")}
          </p>
        </div>
        <div className="md:col-span-4">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">
                      {t("stat.infrastructure.title")}
                      <Info className="h-4 w-4 ml-1" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-md p-3 max-w-xs">
                    <p className="text-sm">
                      {t("stat.infrastructure.description")}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline" className="font-normal">
                <Server className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(infra?.serverCount ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.infrastructure.label.servers")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <HardDrive className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                {(infra?.totalStorage ?? 0).toLocaleString(localeString)}{"+ "}
                {t("stat.infrastructure.label.disk")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Wifi className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                {(infra?.onlineCount ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.infrastructure.label.online")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <MemoryStick className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                {(infra?.totalMemory ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.infrastructure.label.memory")}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
      <AnimatedSection className="grid grid-cols-1 md:grid-cols-8 gap-6 md:gap-10 items-start mt-10" delay={0.1}>
        <div className="md:col-span-4">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">
                      {t("stat.development.title")}
                      <Info className="h-4 w-4 ml-1" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-md p-3 max-w-xs">
                    <p className="text-sm text-center">
                      {t("stat.development.description")}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline" className="font-normal">
                <Hourglass className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {Math.floor((code?.total ?? 0) / 3600).toLocaleString(localeString)}{" "}
                {t("stat.development.label.hours_coded")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Code className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {Math.floor((code?.average ?? 0) / 60).toLocaleString(localeString)}{" "}
                {t("stat.development.label.daily_average")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <FileCode className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {t("stat.development.label.top_language")}{" "}
                {code?.topLanguage ?? "N/A"}
              </Badge>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-4">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">
                      {t("stat.music.title")}
                      <Info className="h-4 w-4 ml-1" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-md p-3 max-w-xs">
                    <p className="text-sm">{t("stat.music.description")}</p>
                  </HoverCardContent>
                </HoverCard>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline" className="font-normal">
                <Music className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(music?.plays ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.music.label.tracks")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Clock className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {Math.floor((music?.listening ?? 0) / 3600).toLocaleString(localeString)}{" "}
                {t("stat.music.label.hours")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <UserRound className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(music?.artists ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.music.label.artists")}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
      <AnimatedSection className="grid grid-cols-1 md:grid-cols-8 gap-6 md:gap-10 items-start mt-10" delay={0.1}>
        <div className="md:col-span-4">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">
                      {t("stat.tracking.title")}
                      <Info className="h-4 w-4 ml-1" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-md p-3 max-w-xs">
                    <p className="text-sm">{t("stat.tracking.description")}</p>
                  </HoverCardContent>
                </HoverCard>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline" className="font-normal">
                <Globe className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(gps?.countries_all ?? gps?.countries ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.tracking.label.countries")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Building2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(gps?.cities_all ?? gps?.cities ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.tracking.label.cities")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <MousePointer2Icon className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(gps?.points ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.tracking.label.points")}
              </Badge>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-4">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">
                      {t("stat.photos.title")}
                      <Info className="h-4 w-4 ml-1" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-md p-3 max-w-xs">
                    <p className="text-sm">{t("stat.photos.description")}</p>
                  </HoverCardContent>
                </HoverCard>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline" className="font-normal">
                <Camera className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(photos?.photos ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.photos.label.photos")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Video className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(photos?.videos ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.photos.label.videos")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Save className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {Math.floor((photos?.usage ?? 0) / 1024 ** 3).toLocaleString(localeString)}{" "}
                {t("stat.photos.label.storage")}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
    </section>
  );
}
