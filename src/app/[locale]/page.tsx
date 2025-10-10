"use server";

import React from "react";
import Stats from "@/components/stats";
import About from "@/components/about";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import Hackathons from "@/components/hackathons";
import { getKomodoStats } from "@/services/komodo-service";
import { getWakapiStats } from "@/services/wakapi-service";
import { getYourSpotifyStats } from "@/services/yourspotify-service";
import { getDawarichStats } from "@/services/dawarich-service";
import { getImmichStats } from "@/services/immich-service";

export default async function PortfolioPage() {
  const komodoStats = await getKomodoStats();
  const wakapiStats = await getWakapiStats();
  const yourspotifyStats = await getYourSpotifyStats();
  const dawarichStats = await getDawarichStats();
  const immichStats = await getImmichStats();

  return (
    <div className="mx-auto">
      <About />
      <Experience />
      <Projects />
      <Hackathons />
      <Stats
        komodoStats={komodoStats}
        wakapiStats={wakapiStats}
        yourspotifyStats={yourspotifyStats}
        dawarichStats={dawarichStats}
        immichStats={immichStats}
      />
      <Contact />
    </div>
  );
}
