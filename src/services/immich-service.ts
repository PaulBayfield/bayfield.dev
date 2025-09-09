"use server";

import { apiRequest } from "./api-requets";
import { ApiResult, ImmichStats } from "./types";

const requestHandler = async <T>(
  endpoint: string,
  method: string,
  cache: number = 0
): Promise<ApiResult<T>> => {
  return await apiRequest<T>({
    endpoint,
    method,
    api_url: process.env.IMMICH_URL,
    check_success: false,
    cacheDuration: cache,
    apikey: process.env.IMMICH_TOKEN,
  });
};

export const getImmichStats = async (): Promise<ApiResult<ImmichStats>> => {
  return requestHandler<ImmichStats>(
    `api/server/statistics`,
    "GET",
    1000 * 60 * 60 * 24 // Cache for 24
  );
};
