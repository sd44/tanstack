'use client';

import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import * as React from 'react';
import { useCallback } from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';

interface SlideItem {
  content: React.ReactNode;
  title: string;
}

interface CarouselPluginProps {
  /**
   * Array of React elements to display as slides
   */
  slides: SlideItem[];
  /**
   * Autoplay delay in milliseconds
   * @default 2000
   */
  autoplayDelay?: number;
  /**
   * Whether to loop the carousel
   * @default true
   */
  loop?: boolean;
  /**
   * Additional class names for the carousel container
   */
  className?: string;
}

export function CarouselPlugin({
  slides,
  autoplayDelay = 2000,
  loop = true,
  className = 'w-full max-w-3xl',
}: CarouselPluginProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,
      stopOnFocusIn: true,
    }),
  ).current;

  const fadePlugin = React.useRef(Fade()).current;

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
      autoplayPlugin.reset();
    },
    [api, autoplayPlugin.reset],
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      className={`relative ${className}`}
      opts={{
        loop,
        containScroll: false,
      }}
      plugins={[autoplayPlugin, fadePlugin]}
      setApi={setApi}
    >
      <CarouselContent className="relative">
        {slides.map((slide, index) => (
          <CarouselItem key={slide.title}>
            <div className="relative overflow-hidden rounded-lg">
              {slide.content}
              {/* Semi-transparent background strip at the bottom */}
              <div className="absolute right-1 bottom-1 left-1 z-10 flex h-12 items-center justify-between rounded-lg bg-black/30 px-4 text-white">
                {/* Title on the left */}
                <div className="max-w-[70%] truncate font-medium text-lg text-white">
                  {slide.title}
                </div>

                {/* Only show dots for the current slide */}
                {index === current && (
                  <div className="flex gap-1.5">
                    {Array.from({ length: count }).map((_, dotIndex) => (
                      <button
                        aria-label={`Go to slide ${dotIndex + 1}`}
                        className={`h-3 w-3 rounded-full transition-colors ${
                          dotIndex === current ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                        }`}
                        key={slide.title}
                        onClick={() => scrollTo(dotIndex)}
                        type="button"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
