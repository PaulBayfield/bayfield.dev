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

/** Infrastructure stats, computed from Dash's servers module. */
export interface InfrastructureStats {
  serverCount: number;
  onlineCount: number;
  /** TB */
  totalStorage: number;
  /** GB */
  totalMemory: number;
}

// Dash (dash.bayfield.dev) API responses: GET /api/m/<module>/...

/** GET /api/m/devtime/summary. Seconds. */
export interface DashCodeSummary {
  total: number;
  days: number;
  average: number;
  topLanguage: string | null;
  topProject: string | null;
}

/** GET /api/m/spotify/summary. listening is in seconds. */
export interface DashMusicSummary {
  plays: number;
  listening: number;
  tracks: number;
  artists: number;
  albums: number;
}

/** GET /api/m/gps/summary. */
export interface DashGpsSummary {
  points: number | null;
  countriesAll: number | null;
  citiesAll: number | null;
  countries: number;
  cities: number;
  days: number;
}

/** GET /api/m/immich/summary. Bytes. */
export interface DashPhotosSummary {
  photos: number;
  videos: number;
  usage: number;
  diskSize: number;
  diskUsed: number;
  diskRatio: number;
  users: number;
}

/** GET /api/m/servers/summary. Ratios are 0–1. */
export interface DashServersSummary {
  servers: number;
  online: number;
  cpu: number | null;
  memory: number | null;
  disk: number | null;
}

/** GET /api/m/servers/servers. Totals are in GB. */
export interface DashServerList {
  rows: {
    id: string;
    name: string;
    state: string;
    memoryTotal: number | null;
    diskTotal: number | null;
  }[];
  total: number;
}
