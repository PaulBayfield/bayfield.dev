"use server";

import { apiRequest } from "./api-requets";
import {
  ApiResult,
  YourSpotifySongsCount,
  YourSpotifyListenTime,
  YourSpotifyArtistsCount,
} from "./types";

const requestHandler = async <T>(
  endpoint: string,
  method: string,
  cache: number = 0
): Promise<ApiResult<T>> => {
  return await apiRequest<T>({
    endpoint,
    method,
    api_url: process.env.YOURSPOTIFY_URL,
    check_success: false,
    cacheDuration: cache,
  });
};

const getYourSpotifySongsCount = async (): Promise<
  ApiResult<YourSpotifySongsCount>
> => {
  const today = new Date().toISOString().split("T")[0];

  return requestHandler<YourSpotifySongsCount>(
    `spotify/songs_per?start=2019-01-01T00:00:00.000Z&end=${today}&timeSplit=all&token=${process.env.YOURSPOTIFY_TOKEN}`,
    "GET",
    1000 * 60 * 60 * 24 // Cache for 24 hours
  );
};

const getYourSpotifyListenTime = async (): Promise<
  ApiResult<YourSpotifyListenTime>
> => {
  const today = new Date().toISOString().split("T")[0];

  return requestHandler<YourSpotifyListenTime>(
    `spotify/time_per?start=2019-01-01T00:00:00.000Z&end=${today}&timeSplit=all&token=${process.env.YOURSPOTIFY_TOKEN}`,
    "GET",
    1000 * 60 * 60 * 24 // Cache for 24
  );
};

const getYourSpotifyArtistsCount = async (): Promise<
  ApiResult<YourSpotifyArtistsCount>
> => {
  const today = new Date().toISOString().split("T")[0];

  return requestHandler<YourSpotifyArtistsCount>(
    `spotify/different_artists_per?start=2019-01-01T00:00:00.000Z&end=${today}&timeSplit=all&token=${process.env.YOURSPOTIFY_TOKEN}`,
    "GET",
    1000 * 60 * 60 * 24 // Cache for 24
  );
};

export const getYourSpotifyStats = async (): Promise<{
  songsCount: ApiResult<YourSpotifySongsCount>;
  listenTime: ApiResult<YourSpotifyListenTime>;
  artistsCount: ApiResult<YourSpotifyArtistsCount>;
}> => {
  const [songsCount, listenTime, artistsCount] = await Promise.all([
    getYourSpotifySongsCount(),
    getYourSpotifyListenTime(),
    getYourSpotifyArtistsCount(),
  ]);

  return { songsCount, listenTime, artistsCount };
};
