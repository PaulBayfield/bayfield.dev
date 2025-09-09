"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export default function PhotosCarousel() {
  return (
    <div className="md:col-span-5">
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm py-0">
        <Carousel
          className="p-5"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent>
            {Array.from({ length: 14 }).map((_, index) => (
              <CarouselItem key={index}>
                <Image
                  src={`/images/carousel/carousel_${index + 1}.png`}
                  alt={`Image ${index + 1}`}
                  width={1200}
                  height={400}
                  className="w-full object-cover rounded-lg h-64 md:h-80 lg:h-90"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center">
            <CarouselPrevious className="p-2 bg-background rounded-full hover:bg-accent/80 transition dark:bg-zinc-800 dark:hover:bg-zinc-700">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </CarouselPrevious>
            <CarouselNext className="p-2 bg-background rounded-full hover:bg-accent/80 transition dark:bg-zinc-800 dark:hover:bg-zinc-700 ml-2">
              <ArrowRight className="h-4 w-4" />
            </CarouselNext>
          </div>
        </Carousel>
      </Card>
    </div>
  );
}
