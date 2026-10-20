export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status: number };

export interface UmamiGetToken {
  token: string;
  user: {
    id: string;
    username: string;
    createdAt: string;
  };
}

export interface UmamiActiveUsers {
  visitors: number;
}

export interface UmamiDateRange {
  startDate: string;
  endDate: string;
}

export interface UmamiStats {
  pageviews: string;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: string;
  comparison: {
    pageviews: string;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: string;
  }
}

export interface KomodoStats {
  serverCount: number;
  totalStorage: number;
  totalStacks: number;
  totalContainers: number;
}

/** GET /api/v1/users/:user/stats/all_time. Breakdowns the user doesn't share are missing. */
export interface DevTimeStats {
  data: {
    id: string;
    username: string;
    range: string;
    start: string;
    end: string;
    status: string;
    total_seconds: number;
    daily_average: number;
    days_including_holidays: number;
    human_readable_total: string;
    human_readable_daily_average: string;
    editors?: DevTimeStatItem[];
    languages?: DevTimeStatItem[];
    machines?: DevTimeStatItem[];
    projects?: DevTimeStatItem[];
    operating_systems?: DevTimeStatItem[];
    categories?: DevTimeStatItem[];
  };
}

export interface DevTimeStatItem {
  name: string;
  total_seconds: number;
  hours: number;
  minutes: number;
  digital: string;
  text: string;
  percent: number;
}

export interface YourSpotifySongsCount {
  _id: null;
  count: number;
  differents: number;
}

export interface YourSpotifyListenTime {
  _id: null;
  count: number;
}

export interface YourSpotifyArtistsCount {
  _id: null;
  artists: [];
  differents: number;
  counts: [];
}

export interface DawarichStats {
  totalDistanceKm: number;
  totalPointsTracked: number;
  totalReverseGeocodedPoints: number;
  totalCountriesVisited: number;
  totalCitiesVisited: number;
  yearlyStats: {
    year: number;
    totalDistanceKm: number;
    totalCountriesVisited: number;
    totalCitiesVisited: number;
    monthlyDistanceKm: {
      january: number;
      february: number;
      march: number;
      april: number;
      may: number;
      june: number;
      july: number;
      august: number;
      september: number;
      october: number;
      november: number;
      december: number;
    };
  }[];
}

export interface ImmichStats {
  photos: number;
  videos: number;
  usage: number;
  usagePhotos: number;
  usageVideos: number;
  usageByUser: {
    userId: string;
    userName: string;
    photos: number;
    videos: number;
    usage: number;
    usagePhotos: number;
    usageVideos: number;
    quotaSizeInBytes: number | null;
  }[];
}
