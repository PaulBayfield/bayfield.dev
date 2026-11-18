"use server";

import { apiRequest } from "./api-request";
import {
  ApiResult,
  DashCodeSummary,
  DashGpsSummary,
  DashMusicSummary,
  DashPhotosSummary,
  DashServerList,
  DashServersSummary,
  InfrastructureStats,
} from "./types";

/**
 * Every stat comes from my data warehouse, through Dash (https://dash.bayfield.dev).
 * One read-only API token (Settings → API) covers every module: devtime, spotify, gps, immich, servers.
 */
const dashRequest = async <T>(endpoint: string): Promise<ApiResult<T>> => {
  return apiRequest<T>({
    endpoint: `api/m/${endpoint}`,
    method: "GET",
    api_url: process.env.DASH_URL?.replace(/\/+$/, ""),
    check_success: false,
    bearer: process.env.DASH_API_KEY || null,
    cacheDuration: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/** All-time coding stats (dev.bayfield.dev). */
export const getCodeStats = async (): Promise<ApiResult<DashCodeSummary>> =>
  dashRequest<DashCodeSummary>("devtime/summary?range=all");

/** All-time listening stats (music.bayfield.dev). */
export const getMusicStats = async (): Promise<ApiResult<DashMusicSummary>> =>
  dashRequest<DashMusicSummary>("spotify/summary?range=all");

/** Location history (gps.bayfield.dev). */
export const getGpsStats = async (): Promise<ApiResult<DashGpsSummary>> =>
  dashRequest<DashGpsSummary>("gps/summary?range=all");

/** Photo library (Immich). */
export const getPhotosStats = async (): Promise<ApiResult<DashPhotosSummary>> =>
  dashRequest<DashPhotosSummary>("immich/summary");

/** Servers (Komodo): count, how many are online, total disk and memory. */
export const getInfrastructureStats = async (): Promise<
  ApiResult<InfrastructureStats>
> => {
  const [summary, list] = await Promise.all([
    dashRequest<DashServersSummary>("servers/summary"),
    dashRequest<DashServerList>("servers/servers"),
  ]);

  if (!summary.success) return summary;
  if (!list.success) return list;

  const rows = list.data.rows ?? [];
  const totalStorageGb = rows.reduce((sum, s) => sum + (s.diskTotal ?? 0), 0);
  const totalMemoryGb = rows.reduce((sum, s) => sum + (s.memoryTotal ?? 0), 0);

  return {
    success: true,
    data: {
      serverCount: summary.data.servers ?? 0,
      onlineCount: summary.data.online ?? 0,
      totalStorage: Math.round((totalStorageGb / 1024) * 10) / 10, // TB
      totalMemory: Math.round(totalMemoryGb),
    },
  };
};
