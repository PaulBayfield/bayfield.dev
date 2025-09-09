import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.WEB_URL}`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          fr: `${process.env.WEB_URL}/fr`,
          en: `${process.env.WEB_URL}/en`,
        },
      },
    },
  ];
}
