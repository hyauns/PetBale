'use client'

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import type { HomeLogo } from '@/lib/shopify/content';

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos?: HomeLogo[] | Logo[];
};

const brandLogos: Logo[] = Array.from({ length: 13 }, (_, i) => ({
  alt: `Brand ${i + 1}`,
  src: `/Brands/${i + 1}.png`
}));

function toLogo(l: HomeLogo | Logo): Logo {
  if ('src' in l) return l
  return { src: l.imageUrl ?? '', alt: l.alt }
}

export function LogoCloud({ logos = brandLogos, className = "", ...props }: LogoCloudProps) {
  const resolved = logos.map(toLogo).filter((l) => l.src)
  return (
    <div 
      className={`relative w-screen max-w-none left-1/2 right-1/2 -translate-x-1/2 py-4 md:py-6 select-none overflow-hidden border-y-2 border-black ${className}`} 
      style={{ backgroundColor: 'lab(97.4803% 0.224501 3.04738)' }}
      {...props}
    >
      <InfiniteSlider gap={96} reverse speed={40} speedOnHover={20}>
        {resolved.map((logo) => (
          <div key={`logo-container-${logo.alt}`} className="relative h-16 w-48 sm:h-20 sm:w-56 md:h-24 md:w-64 flex items-center justify-center px-4">
            <img
              alt={logo.alt}
              className="pointer-events-none max-h-full max-w-full select-none object-contain opacity-100 transition-all duration-300 filter-none grayscale-0"
              loading="lazy"
              src={logo.src}
            />
          </div>
        ))}
      </InfiniteSlider>

      {/* Left Blur Fade */}
      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 left-0 h-full w-[100px] md:w-[220px]"
        style={{ backgroundImage: 'linear-gradient(to right, lab(97.4803% 0.224501 3.04738), lab(97.4803% 0.224501 3.04738 / 85%), transparent)' }}
        direction="left"
      />
      {/* Right Blur Fade */}
      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 right-0 h-full w-[100px] md:w-[220px]"
        style={{ backgroundImage: 'linear-gradient(to left, lab(97.4803% 0.224501 3.04738), lab(97.4803% 0.224501 3.04738 / 85%), transparent)' }}
        direction="right"
      />
    </div>
  );
}
