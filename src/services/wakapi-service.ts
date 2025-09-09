"use server";

import { apiRequest } from "./api-requets";
import { ApiResult, WakapiStats } from "./types";

const requestHandler = async <T>(
  endpoint: string,
  method: string,
  cache: number = 0
): Promise<ApiResult<T>> => {
  return await apiRequest<T>({
    endpoint,
    method,
    api_url: process.env.WAKAPI_URL,
    check_success: false,
    cacheDuration: cache,
  });
};

export const getWakapiStats = async (): Promise<ApiResult<WakapiStats>> => {
  return requestHandler<WakapiStats>(
    `stats/all_time`,
    "GET",
    1000 * 60 * 60 * 24 // Cache for 24 hours
  );
};
