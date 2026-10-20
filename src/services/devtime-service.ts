"use server";

import { apiRequest } from "./api-request";
import { ApiResult, DevTimeStats } from "./types";

/**
 * All-time coding stats from DevTime (https://dev.bayfield.dev), WakaTime-compatible.
 * DEVTIME_USER is the public username; with DEVTIME_API_KEY the request works even when
 * the public API is off, and returns every breakdown.
 */
export const getDevTimeStats = async (): Promise<ApiResult<DevTimeStats>> => {
  const user = process.env.DEVTIME_API_KEY ? "current" : (process.env.DEVTIME_USER ?? "");
  return apiRequest<DevTimeStats>({
    endpoint: `api/v1/users/${encodeURIComponent(user)}/stats/all_time`,
    method: "GET",
    api_url: process.env.DEVTIME_URL?.replace(/\/+$/, ""),
    check_success: false,
    bearer: process.env.DEVTIME_API_KEY || null,
    cacheDuration: 1000 * 60 * 60 * 24, // 24 hours
  });
};
