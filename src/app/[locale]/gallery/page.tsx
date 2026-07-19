import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { imageSize } from "image-size";
import { getTranslations } from "next-intl/server";
import Gallery, { type Photo } from "@/components/gallery";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gallery",
  };
}

function getPhotos(): Photo[] {
  const dir = path.join(process.cwd(), "public", "images", "gallery");

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => {
      const { width, height } = imageSize(
        fs.readFileSync(path.join(dir, file))
      );

      return {
        src: `/images/gallery/${file}`,
        width,
        height,
      };
    });
}

export default async function GalleryPage() {
  const t = await getTranslations("GalleryPage");
  const photos = getPhotos();

  return (
    <Gallery
      photos={photos}
      title={t("title")}
      description={t("description")}
      empty={t("empty")}
    />
  );
}
