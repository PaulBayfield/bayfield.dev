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
  Car,
  Server,
  Box,
  HardDrive,
  Layers,
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

export default async function Stats({
  komodoStats,
  wakapiStats,
  yourspotifyStats,
  dawarichStats,
  immichStats,
}: {
  komodoStats?: any;
  wakapiStats?: any;
  yourspotifyStats?: any;
  dawarichStats?: any;
  immichStats?: any;
}) {
  const t = await getTranslations("Stats");

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
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6 md:gap-10 items-start">
        <div className="md:col-span-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            {t("title")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("description")}
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
                {(komodoStats?.serverCount ?? 0).toLocaleString(
                  localeString
                )}{" "}
                {t("stat.infrastructure.label.servers")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <HardDrive className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                {(komodoStats?.totalStorage ?? 0).toLocaleString(localeString)}{" "}
                {t("stat.infrastructure.label.disk")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Layers className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                {(komodoStats?.totalStacks ?? 0).toLocaleString(
                  localeString
                )}{" "}
                {t("stat.infrastructure.label.stacks")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Box className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                {(komodoStats?.totalContainers ?? 0).toLocaleString(
                  localeString
                )}{" "}
                {t("stat.infrastructure.label.containers")}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6 md:gap-10 items-start mt-10">
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
                {Math.floor(
                  (wakapiStats?.data?.data.total_seconds ?? 0) / 3600
                ).toLocaleString(localeString)}{" "}
                {t("stat.development.label.hours_coded")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Code className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {Math.floor(
                  (wakapiStats?.data?.data.daily_average ?? 0) / 60
                ).toLocaleString(localeString)}{" "}
                {t("stat.development.label.daily_average")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <FileCode className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {t("stat.development.label.top_language")}{" "}
                {wakapiStats?.data?.data.languages?.[0]?.name ?? "N/A"}
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
                <Music className="h-4 w-4 text-zinc-90 dark:text-zinc-100" />
                {(
                  yourspotifyStats?.songsCount?.data[0].count ?? 0
                ).toLocaleString(localeString)}{" "}
                {t("stat.music.label.tracks")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Clock className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {Math.floor(
                  (yourspotifyStats?.listenTime?.data[0].count ?? 0) /
                    1000 /
                    60 /
                    60
                ).toLocaleString(localeString)}{" "}
                {t("stat.music.label.hours")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <UserRound className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(
                  yourspotifyStats?.artistsCount?.data[0].differents ?? 0
                ).toLocaleString(localeString)}{" "}
                {t("stat.music.label.artists")}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6 md:gap-10 items-start mt-10">
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
                <Car className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(dawarichStats?.data?.totalDistanceKm ?? 0).toLocaleString(
                  localeString
                )}{" "}
                {t("stat.tracking.label.km")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <MousePointer2Icon className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(dawarichStats?.data?.totalPointsTracked ?? 0).toLocaleString(
                  localeString
                )}{" "}
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
                {(immichStats?.data?.photos ?? 0).toLocaleString(
                  localeString
                )}{" "}
                {t("stat.photos.label.photos")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Video className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {(immichStats?.data?.videos ?? 0).toLocaleString(
                  localeString
                )}{" "}
                {t("stat.photos.label.videos")}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Save className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                {Math.floor(
                  immichStats?.data?.usage
                    ? immichStats.data.usage / 1024 ** 3
                    : 0
                ).toLocaleString(localeString, {
                  maximumFractionDigits: 2,
                })}{" "}
                {t("stat.photos.label.storage")}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
