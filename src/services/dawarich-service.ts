"use server";

import { apiRequest } from "./api-requets";
import { ApiResult, DawarichStats } from "./types";

const requestHandler = async <T>(
  endpoint: string,
  method: string,
  cache: number = 0
): Promise<ApiResult<T>> => {
  return await apiRequest<T>({
    endpoint,
    method,
    api_url: process.env.DAWARICH_URL,
    check_success: false,
    cacheDuration: cache,
    bearer: process.env.DAWARICH_TOKEN,
  });
};

export const getDawarichStats = async (): Promise<ApiResult<DawarichStats>> => {
  return requestHandler<DawarichStats>(
    `api/v1/stats`,
    "GET",
    1000 * 60 * 60 * 24 // Cache for 24
  );
};
