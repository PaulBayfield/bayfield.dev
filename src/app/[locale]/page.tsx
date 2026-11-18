"use server";

import React from "react";
import Stats from "@/components/stats";
import About from "@/components/about";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import Hackathons from "@/components/hackathons";
import {
  getCodeStats,
  getGpsStats,
  getInfrastructureStats,
  getMusicStats,
  getPhotosStats,
} from "@/services/dash-service";

export default async function PortfolioPage() {
  const [infrastructureStats, codeStats, musicStats, gpsStats, photosStats] =
    await Promise.all([
      getInfrastructureStats(),
      getCodeStats(),
      getMusicStats(),
      getGpsStats(),
      getPhotosStats(),
    ]);

  return (
    <div className="mx-auto">
      <About />
      <Experience />
      <Projects />
      <Hackathons />
      <Stats
        infrastructureStats={infrastructureStats}
        codeStats={codeStats}
        musicStats={musicStats}
        gpsStats={gpsStats}
        photosStats={photosStats}
      />
      <Contact />
    </div>
  );
}
