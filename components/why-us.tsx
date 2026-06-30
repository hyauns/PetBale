'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import shopifyImageLoader from '@/lib/shopify-image-loader'
import { TextRotate } from '@/components/ui/text-rotate'
import type { HomeFeature } from '@/lib/shopify/content'

// SVG Graphics for the 4 Columns - Proportional & Balanced Scaling for PC & Mobile

// Illustration 1: Free Shipping $40+ using local image 1.png
const FreeShippingGraphic = () => (
  <div className="relative w-full h-[280px] md:h-[360px] xl:h-[300px] 2xl:h-[420px] flex items-center justify-center select-none pointer-events-none">
    {/* Floating parcel image 1.png */}
    <motion.div
      animate={{ y: [0, -16, 0], rotate: [0, 2, 0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 w-[240px] h-[240px] md:w-[320px] md:h-[320px] xl:w-[260px] xl:h-[260px] 2xl:w-[380px] 2xl:h-[380px] flex items-center justify-center"
    >
      <Image
        src="/images/1.webp"
        alt="Free Shipping"
        width={280}
        height={280}
        sizes="(min-width: 1536px) 380px, (min-width: 1280px) 260px, (min-width: 768px) 320px, 240px"
        className="max-w-full max-h-full object-contain filter drop-shadow-[6px_6px_0px_rgba(0,0,0,0.15)] 2xl:drop-shadow-[10px_10px_0px_rgba(0,0,0,0.15)]"
      />
    </motion.div>
  </div>
);

// Illustration 2: Top Pet Brands using local image 2.png
const TopBrandsGraphic = () => (
  <div className="relative w-full h-[280px] md:h-[360px] xl:h-[300px] 2xl:h-[420px] flex items-center justify-center select-none pointer-events-none">
    {/* Floating brands image 2.png */}
    <motion.div
      animate={{ y: [0, -16, 0], rotate: [0, -2, 0, 2, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      className="relative z-10 w-[240px] h-[240px] md:w-[320px] md:h-[320px] xl:w-[260px] xl:h-[260px] 2xl:w-[380px] 2xl:h-[380px] flex items-center justify-center"
    >
      <Image
        src="/images/2.webp"
        alt="Top Pet Brands"
        width={280}
        height={280}
        sizes="(min-width: 1536px) 380px, (min-width: 1280px) 260px, (min-width: 768px) 320px, 240px"
        className="max-w-full max-h-full object-contain filter drop-shadow-[6px_6px_0px_rgba(0,0,0,0.15)] 2xl:drop-shadow-[10px_10px_0px_rgba(0,0,0,0.15)]"
      />
    </motion.div>
  </div>
);

// Illustration 3: Reorder Made Easy using local image 3.png
const ReorderGraphic = () => (
  <div className="relative w-full h-[280px] md:h-[360px] xl:h-[300px] 2xl:h-[420px] flex items-center justify-center select-none pointer-events-none">
    {/* Floating reorder image 3.png */}
    <motion.div
      animate={{ y: [0, -16, 0], rotate: [0, -2, 0, 2, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      className="relative z-10 w-[240px] h-[240px] md:w-[320px] md:h-[320px] xl:w-[260px] xl:h-[260px] 2xl:w-[380px] 2xl:h-[380px] flex items-center justify-center"
    >
      <Image
        src="/images/3.webp"
        alt="Reorder Made Easy"
        width={280}
        height={280}
        sizes="(min-width: 1536px) 380px, (min-width: 1280px) 260px, (min-width: 768px) 320px, 240px"
        className="max-w-full max-h-full object-contain filter drop-shadow-[6px_6px_0px_rgba(0,0,0,0.15)] 2xl:drop-shadow-[10px_10px_0px_rgba(0,0,0,0.15)]"
      />
    </motion.div>
  </div>
);

// Illustration 4: Pet Food, Delivered using local image 4.png
const DeliveredGraphic = () => (
  <div className="relative w-full h-[280px] md:h-[360px] xl:h-[300px] 2xl:h-[420px] flex items-center justify-center select-none pointer-events-none">
    {/* Floating delivered food image 4.png */}
    <motion.div
      animate={{ y: [0, -16, 0], rotate: [0, 2, 0, -2, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      className="relative z-10 w-[240px] h-[240px] md:w-[320px] md:h-[320px] xl:w-[260px] xl:h-[260px] 2xl:w-[380px] 2xl:h-[380px] flex items-center justify-center"
    >
      <Image
        src="/images/4.webp"
        alt="Pet Food, Delivered"
        width={280}
        height={280}
        sizes="(min-width: 1536px) 380px, (min-width: 1280px) 260px, (min-width: 768px) 320px, 240px"
        className="max-w-full max-h-full object-contain filter drop-shadow-[6px_6px_0px_rgba(0,0,0,0.15)] 2xl:drop-shadow-[10px_10px_0px_rgba(0,0,0,0.15)]"
      />
    </motion.div>
  </div>
);

// Continuous Winding Golden Tube SVG (Running behind the graphics)
const WindingNoodleTube = () => (
  <div className="absolute inset-x-0 top-1/2 -translate-y-12 w-full h-[150px] md:h-[180px] xl:h-[160px] 2xl:h-[220px] pointer-events-none z-0 hidden xl:block">
    <svg 
      className="w-full h-full" 
      viewBox="0 0 1440 280" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <style>{`
        .tube-outline { stroke-width: 16px; }
        .tube-body { stroke-width: 12px; }
        .tube-highlight { stroke-width: 4px; }
        @media (min-width: 1536px) {
          .tube-outline { stroke-width: 24px; }
          .tube-body { stroke-width: 18px; }
          .tube-highlight { stroke-width: 5px; }
        }
      `}</style>
      
      {/* 1. Black Outline (Base layer) */}
      <path 
        className="tube-outline"
        d="M -50 150 C 150 150, 180 60, 220 60 C 270 60, 290 220, 220 220 C 150 220, 200 150, 320 150 C 450 150, 480 240, 600 240 C 720 240, 750 120, 850 120 C 930 120, 960 220, 1020 220 C 1080 220, 1110 80, 1160 80 C 1220 80, 1260 220, 1380 180 C 1450 150, 1500 150, 1550 150" 
        stroke="black" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* 2. Shiny Golden Body (Middle layer) */}
      <path 
        className="tube-body"
        d="M -50 150 C 150 150, 180 60, 220 60 C 270 60, 290 220, 220 220 C 150 220, 200 150, 320 150 C 450 150, 480 240, 600 240 C 720 240, 750 120, 850 120 C 930 120, 960 220, 1020 220 C 1080 220, 1110 80, 1160 80 C 1220 80, 1260 220, 1380 180 C 1450 150, 1500 150, 1550 150" 
        stroke="#ffea79" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* 3. 3D Light Highlight (Inner top layer) */}
      <path 
        className="tube-highlight"
        d="M -50 147 C 150 147, 180 57, 220 57 C 270 57, 290 217, 220 217 C 150 217, 200 147, 320 147 C 450 147, 480 237, 600 237 C 720 237, 750 117, 850 117 C 930 117, 960 217, 1020 217 C 1080 217, 1110 77, 1160 77 C 1220 77, 1260 217, 1380 177 C 1450 147, 1500 147, 1550 147" 
        stroke="#FFF2B2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  </div>
);

// Continuous Winding Golden Tube SVG for Mobile/Tablet (Vertical format running down center)
const VerticalWindingTube = () => (
  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[150px] md:w-[180px] h-full pointer-events-none z-0 xl:hidden">
    <svg 
      className="w-full h-full" 
      viewBox="0 0 280 1440" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <style>{`
        .v-tube-outline { stroke-width: 12px; }
        .v-tube-body { stroke-width: 8px; }
        .v-tube-highlight { stroke-width: 3px; }
        @media (min-width: 768px) {
          .v-tube-outline { stroke-width: 16px; }
          .v-tube-body { stroke-width: 12px; }
          .v-tube-highlight { stroke-width: 4px; }
        }
      `}</style>
      
      {/* 1. Black Outline (Base layer) */}
      <path 
        className="v-tube-outline"
        d="M 140 -50 C 140 150, 60 180, 60 220 C 60 270, 220 290, 220 220 C 220 150, 140 200, 140 320 C 140 450, 240 480, 240 600 C 240 720, 120 750, 120 850 C 120 930, 220 960, 220 1020 C 220 1080, 80 1110, 80 1160 C 80 1220, 220 1260, 180 1380 C 150 1450, 150 1500, 150 1550" 
        stroke="black" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* 2. Shiny Golden Body (Middle layer) */}
      <path 
        className="v-tube-body"
        d="M 140 -50 C 140 150, 60 180, 60 220 C 60 270, 220 290, 220 220 C 220 150, 140 200, 140 320 C 140 450, 240 480, 240 600 C 240 720, 120 750, 120 850 C 120 930, 220 960, 220 1020 C 220 1080, 80 1110, 80 1160 C 80 1220, 220 1260, 180 1380 C 150 1450, 150 1500, 150 1550" 
        stroke="#ffea79" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* 3. 3D Light Highlight (Inner top layer) */}
      <path 
        className="v-tube-highlight"
        d="M 137 -50 C 137 150, 57 180, 57 220 C 57 270, 217 290, 217 220 C 217 150, 137 200, 137 320 C 137 450, 237 480, 237 600 C 237 720, 117 750, 117 850 C 117 930, 217 960, 217 1020 C 217 1080, 77 1110, 77 1160 C 77 1220, 217 1260, 177 1380 C 147 1450, 147 1500, 147 1550" 
        stroke="#FFF2B2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  </div>
);

const DEFAULT_STEPS = [
  { number: 1, title: 'Free Shipping $40+', imageUrl: null as string | null, imageAlt: 'Free Shipping' },
  { number: 2, title: 'Top Pet Brands', imageUrl: null as string | null, imageAlt: 'Top Pet Brands' },
  { number: 3, title: 'AUTHENTIC & SEALED', imageUrl: null as string | null, imageAlt: 'Authentic' },
  { number: 4, title: 'Pet Food, Delivered', imageUrl: null as string | null, imageAlt: 'Delivered' },
];

const DEFAULT_GRAPHICS = [FreeShippingGraphic, TopBrandsGraphic, ReorderGraphic, DeliveredGraphic]

function FeatureImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full h-[280px] md:h-[360px] xl:h-[300px] 2xl:h-[420px] flex items-center justify-center select-none pointer-events-none">
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, 2, 0, -2, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-[240px] h-[240px] md:w-[320px] md:h-[320px] xl:w-[260px] xl:h-[260px] 2xl:w-[380px] 2xl:h-[380px] flex items-center justify-center"
      >
        <Image
          src={src}
          alt={alt}
          width={280}
          height={280}
          loader={shopifyImageLoader}
          sizes="(min-width: 1536px) 380px, (min-width: 1280px) 260px, (min-width: 768px) 320px, 240px"
          className="max-w-full max-h-full object-contain filter drop-shadow-[6px_6px_0px_rgba(0,0,0,0.15)] 2xl:drop-shadow-[10px_10px_0px_rgba(0,0,0,0.15)]"
        />
      </motion.div>
    </div>
  )
}

export default function WhyUs({ features }: { features?: HomeFeature[] }) {
  const stepsData = features && features.length > 0
    ? features.map((f, i) => ({
        number: f.number || i + 1,
        title: f.title,
        Graphic: f.imageUrl
          ? () => <FeatureImage src={f.imageUrl as string} alt={f.imageAlt || f.title} />
          : DEFAULT_GRAPHICS[i % DEFAULT_GRAPHICS.length],
      }))
    : DEFAULT_STEPS.map((s, i) => ({
        number: s.number,
        title: s.title,
        Graphic: DEFAULT_GRAPHICS[i],
      }))
  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-b from-[#FDE047] via-[#FEF9C3] to-white w-screen max-w-none left-1/2 right-1/2 -translate-x-1/2 select-none">
      
      {/* Title Header */}
      <div className="text-center mb-10 sm:mb-14 relative z-10 max-w-3xl mx-auto px-4">
        {/* Small "Why Us?" subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="font-attahost text-4xl sm:text-5xl text-black tracking-wide mb-3 font-normal"
        >
          Why Us?
        </motion.div>
        
        {/* Main "THE PETBALE WAY" Title */}
        <h2 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight flex items-center justify-center overflow-hidden py-2 select-none">
          <TextRotate
            texts={["THE PETBALE WAY"]}
            auto={false}
            loop={false}
            animatePresenceInitial={true}
            staggerDuration={0.03}
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 11, stiffness: 150, delay: 0.1 }}
            elementLevelClassName="text-black"
            mainClassName="text-black inline-flex flex-wrap justify-center"
          />
        </h2>
      </div>

      {/* Main Experience Visual Pipeline - Stretching FULL-WIDTH */}
      <div className="relative w-full max-w-[96%] mx-auto px-4 lg:px-8 py-4 min-h-[300px] md:min-h-[400px] xl:min-h-[350px] 2xl:min-h-[500px]">
        {/* 3D Winding Gold Tube behind graphics (Horizontal on widescreen, Vertical on Mobile/Tablet) */}
        <WindingNoodleTube />
        <VerticalWindingTube />

        {/* 4 Steps Grid Layout - 2 columns on small/medium screens, 4 columns on wide monitors to provide ample container space */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 lg:gap-16 xl:gap-8 2xl:gap-12 relative z-10">
          {stepsData.map((step, idx) => {
            const Graphic = step.Graphic
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                {/* Step Number + Title Row */}
                <div className="flex items-center gap-3 lg:gap-4 justify-center mb-4 lg:mb-6">
                  {/* Pink Number Badge */}
                  <span className="w-11 h-11 md:w-14 md:h-14 2xl:w-16 2xl:h-16 rounded-full bg-[#FF69B4] border-3 border-black flex items-center justify-center font-black text-black text-lg md:text-xl 2xl:text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    {step.number}
                  </span>
                  
                  {/* Description Title */}
                  <span className="font-black text-lg md:text-xl xl:text-2xl 2xl:text-3xl text-black tracking-tight uppercase italic">
                    {step.title}
                  </span>
                </div>

                {/* Pop-Art SVG Illustration Container sitting on the Noodle */}
                <div className="h-[280px] md:h-[360px] xl:h-[300px] 2xl:h-[420px] w-full flex items-center justify-center relative mt-2">
                  <Graphic />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
