"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Camera, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUmami } from "next-umami";

export interface Photo {
  src: string;
  width: number;
  height: number;
}

// Grid row unit (px) used by `auto-rows-[var(--gallery-row)]` — each tile's
// row-span is derived from its real aspect ratio against this unit, so
// landscape photos stay short and portrait photos stay tall.
const ROW_UNIT = 10;
const GAP = 16;
// Approximate rendered column width across breakpoints, used only to turn
// an aspect ratio into a row-span count — doesn't need to be exact.
const COLUMN_WIDTH = 280;

function rowSpan(photo: Photo) {
  const ratio = photo.height / photo.width;
  const span = Math.round((COLUMN_WIDTH * ratio + GAP) / (ROW_UNIT + GAP));
  // Clamp so a very panoramic or very tall photo doesn't break the rhythm
  // of the grid, while everything in between still reflects its own ratio.
  return Math.min(48, Math.max(14, span));
}

interface Props {
  photos: Photo[];
  title: string;
  description: string;
  empty: string;
}

export default function Gallery({ photos, title, description, empty }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const umami = useUmami();

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close, showPrev, showNext]);

  useEffect(() => {
    if (activeIndex === null) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [activeIndex]);

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 flex items-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary shrink-0">
          <Camera className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">{description}</p>
        </div>
      </motion.div>

      {photos.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 py-24 text-center text-sm text-zinc-500">
          {empty}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[10px]">
          {photos.map((photo, idx) => (
            <motion.button
              key={photo.src}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 8) * 0.05, ease: "easeOut" }}
              style={{ gridRowEnd: `span ${rowSpan(photo)}` }}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 text-left cursor-zoom-in"
              onClick={() => {
                setActiveIndex(idx);
                umami.event("Gallery.Open", { index: idx });
              }}
            >
              <Image
                src={photo.src}
                alt={`${title} ${idx + 1}`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={close}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              <X className="h-6 w-6" />
            </Button>

            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                    umami.event("Gallery.Prev");
                  }}
                >
                  <ChevronLeft className="h-7 w-7" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                    umami.event("Gallery.Next");
                  }}
                >
                  <ChevronRight className="h-7 w-7" />
                </Button>
              </>
            )}

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative h-[75vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[activeIndex].src}
                alt={`${title} ${activeIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>

            <p className="mt-4 text-sm text-zinc-400 select-none">
              {activeIndex + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
