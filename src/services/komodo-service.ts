"use server";

import { KomodoClient, Types } from "komodo_client";
import { KomodoStats } from "./types";

const komodo = KomodoClient(`${process.env.KOMODO_URL}`, {
  type: "api-key",
  params: {
    key: `${process.env.KOMODO_API_KEY}`,
    secret: `${process.env.KOMODO_API_SECRET}`,
  },
});

const cacheDuration = 1000 * 60 * 60 * 24; // Cache for 24 hours

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, { data: any; expiry: number }>();

async function getKomodoServers(): Promise<Types.Server[]> {
  return await komodo.read("ListFullServers", {});
}

async function getKomodoServerStats(
  server: string
): Promise<Types.GetSystemStatsResponse> {
  return await komodo.read("GetSystemStats", { server });
}

async function getKomodoServerContainers(
  server: string
): Promise<Types.ListDockerContainersResponse> {
  return await komodo.read("ListDockerContainers", { server });
}

async function getKomodoStacks(): Promise<Types.ListStacksResponse> {
  return await komodo.read("ListStacks", {});
}

export async function getKomodoStats(): Promise<KomodoStats> {
  const cacheKey = `komodoStats`;

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (Date.now() < cached.expiry) {
      return cached.data;
    } else {
      cache.delete(cacheKey);
    }
  }

  const servers: Types.Server[] = await getKomodoServers();

  let totalStorage = 0;
  let totalStacks = 0;
  let totalContainers = 0;

  for (const server of servers) {
    if (server.config?.enabled === true) {
      try {
        const stats = await getKomodoServerStats(server.name);

        for (const disk of stats?.disks || []) {
          totalStorage += disk.total_gb || 0;
        }

        const containers = await getKomodoServerContainers(server.name);
        totalContainers += containers.length;
      } catch (error) {
        console.error(`Failed to fetch info for server ${server.name}:`, error);
      }
    }

    const stacks = await getKomodoStacks();
    totalStacks = stacks.length;
  }

  const data = {
    serverCount: servers.length,
    totalStorage: Math.round((totalStorage / 1024) * 10) / 10,
    totalStacks,
    totalContainers,
  };

  if (cacheDuration > 0) {
    cache.set(cacheKey, {
      data: data,
      expiry: Date.now() + cacheDuration,
    });
  }

  return data;
}
