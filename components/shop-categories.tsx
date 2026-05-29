'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TextRotate } from '@/components/ui/text-rotate'
import { Check } from 'lucide-react'
import type { HomeCategory } from '@/lib/shopify/content'

// Define the Category structure
export interface CategoryTier {
  name: string;
  icon: string; // Emoji representing the category
  imageSrc: string; // Static pet/product image path
  slug: string; // URL collection page slug
  description?: string;
  features?: string[];
  popular?: boolean;
  color: string; // Tailwind color name for button & icon styling
  accentColor: string; // Hex color for spring bounce styling
  ctaText: string;
}

const defaultCategories: CategoryTier[] = [
  {
    name: "Dog Food",
    icon: "🐕",
    imageSrc: "/images/category/1.png",
    slug: "dog-food",
    popular: true,
    color: "pink",
    accentColor: "#FF69B4",
    ctaText: "EXPLORE ➔",
  },
  {
    name: "Dog Flea & Tick",
    icon: "🪱",
    imageSrc: "/images/category/2.png",
    slug: "flea-tick",
    popular: false,
    color: "orange",
    accentColor: "#ffea79",
    ctaText: "EXPLORE ➔",
  },
  {
    name: "Dog Treats",
    icon: "🥩",
    imageSrc: "/images/category/3.png",
    slug: "dog-treats",
    popular: false,
    color: "teal",
    accentColor: "#4AD395",
    ctaText: "EXPLORE ➔",
  },
  {
    name: "Cat Food",
    icon: "🐈",
    imageSrc: "/images/category/4.png",
    slug: "cat-food",
    popular: true,
    color: "blue",
    accentColor: "#6CD1FF",
    ctaText: "EXPLORE ➔",
  },
  {
    name: "Cat Litter",
    icon: "📦",
    imageSrc: "/images/category/5.png",
    slug: "cat-litter",
    popular: false,
    color: "purple",
    accentColor: "#B19FFB",
    ctaText: "EXPLORE ➔",
  },
  {
    name: "Deals",
    icon: "🔥",
    imageSrc: "/images/category/6.png",
    slug: "deals",
    popular: false,
    color: "yellow",
    accentColor: "#FFEA79",
    ctaText: "EXPLORE ➔",
  },
];

function fromHomeCategory(c: HomeCategory): CategoryTier {
  return {
    name: c.name,
    icon: c.iconEmoji,
    imageSrc: c.imageUrl ?? '',
    slug: c.targetSlug,
    popular: c.popular,
    color: 'pink',
    accentColor: c.accentColor,
    ctaText: c.ctaText,
  }
}

export default function ShopCategories({ categories }: { categories?: HomeCategory[] }) {
  const items = categories && categories.length > 0
    ? categories.map(fromHomeCategory)
    : defaultCategories
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Velocity and momentum tracking refs
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;

    // Reset momentum tracking
    velocity.current = 0;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      startMomentum();
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      startMomentum();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2.5; // Increased speed multiplier for instant responsiveness
    sliderRef.current.scrollLeft = scrollLeft.current - walk;

    // Calculate current scroll velocity
    const currentTime = Date.now();
    const dt = currentTime - lastTime.current;
    if (dt > 0) {
      const dx = e.pageX - lastX.current;
      velocity.current = dx / dt;
    }
    lastX.current = e.pageX;
    lastTime.current = currentTime;
  };

  const startMomentum = () => {
    if (!sliderRef.current) return;
    let currentVelocity = velocity.current * 16; // Swipe force
    const friction = 0.95; // Smooth deceleration factor

    const step = () => {
      if (Math.abs(currentVelocity) < 0.15 || !sliderRef.current) {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        return;
      }
      sliderRef.current.scrollLeft -= currentVelocity;
      currentVelocity *= friction;
      animationFrameId.current = requestAnimationFrame(step);
    };

    animationFrameId.current = requestAnimationFrame(step);
  };

  React.useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white via-[#B8ECFF] to-[#6CD1FF] border-b-2 border-black w-screen max-w-none left-1/2 right-1/2 -translate-x-1/2 select-none">
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Background Dots Grid */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#0000000a 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }} 
      />

      {/* Dynamic Header - Styled EXACTLY like "The Best Sellers" section */}
      <div className="text-center mb-10 sm:mb-14 relative z-10 max-w-3xl mx-auto px-4 select-none">
        {/* "Shop" Header immediately above with wavy underline and elegant staggered drawing */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col items-center mb-6"
        >
          <span className="font-attahost text-4xl sm:text-5xl text-black tracking-wide font-normal">
            Shop
          </span>
          <svg width="36" height="6" viewBox="0 0 36 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-2 text-black">
            <motion.path
              d="M1 3.5C4.5 3.5 6.5 1.5 10 1.5C13.5 1.5 15.5 5 19 5C22.5 5 24.5 1.5 28 1.5C31.5 1.5 33.5 3.5 35 3.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
        
        {/* Main "BY CATEGORY" Character Staggered Bounce Title */}
        <h2 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight flex items-center justify-center overflow-hidden py-2 select-none">
          <TextRotate
            texts={["By Category"]}
            auto={false}
            loop={false}
            animatePresenceInitial={true}
            staggerDuration={0.03}
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 11, stiffness: 150, delay: 0.12 }}
            elementLevelClassName="text-black"
            mainClassName="text-black inline-flex flex-wrap justify-center"
          />
        </h2>
      </div>

      {/* Drag Slider Container */}
      <div 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full max-w-[96%] mx-auto flex justify-start xl:justify-center gap-6 overflow-x-auto py-6 px-4 z-10 relative cursor-grab active:cursor-grabbing hide-scrollbar"
      >
        {items.map((tier, index) => (
          <div key={tier.name} className="w-[280px] sm:w-[320px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              className={cn(
                "relative group",
                "transition-all duration-300",
                index % 3 === 0 && "rotate-[-1deg]",
                index % 3 === 1 && "rotate-[1deg]",
                index % 3 === 2 && "rotate-[-1.5deg]"
              )}
            >
              {/* Card background outline with neo-brutalist drop-shadow */}
              <div
                className={cn(
                  "absolute inset-0 bg-white border-3 border-black rounded-2xl",
                  "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
                  "transition-all duration-300",
                  "group-hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
                  "group-hover:-translate-x-1",
                  "group-hover:-translate-y-1"
                )}
              />

              <div className="relative p-5 flex flex-col justify-between h-[450px] font-tbj-interval">
                {/* Popular Badge */}
                {tier.popular && (
                  <motion.div
                    animate={{ rotate: [12, 10, 14, 12] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3 -right-3 bg-amber-400 text-black font-black px-4 py-1 rounded-full text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20"
                  >
                    Popular! 🔥
                  </motion.div>
                )}

                {/* Content Wrapper */}
                <div className="flex-1 flex flex-col justify-start">
                  {/* Category Icon and Name (Centered Row) */}
                  <div className="flex items-center justify-center gap-3 mb-4 w-full">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-full flex-shrink-0",
                        "flex items-center justify-center text-xl",
                        "border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10"
                      )}
                    >
                      {tier.icon}
                    </div>
                    <h3 className="font-black text-lg text-black uppercase tracking-tight leading-none text-left">
                      {tier.name}
                    </h3>
                  </div>

                  {/* LARGE CATEGORY IMAGE - Placed beautifully inside the box */}
                  <div className="w-full h-64 bg-white rounded-xl overflow-hidden relative flex items-center justify-center p-3">
                    <Image
                      src={tier.imageSrc}
                      alt={tier.name}
                      width={400}
                      height={400}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none"
                    />
                  </div>
                </div>

                {/* Neo-brutalist Action Button */}
                <Link href={`/collections/${tier.slug}`} className="w-full mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full h-12 font-black text-sm uppercase tracking-wider relative cursor-pointer border-3 border-black rounded-xl transition-all duration-200 flex items-center justify-center text-black",
                      "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    )}
                    style={{ backgroundColor: index % 2 === 0 ? '#6cd1ff' : '#ffea79' }}
                  >
                    {tier.ctaText}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      
      {/* Decorative badges at the bottom of the section */}
      <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-40 left-12 text-4xl rotate-12">
          🐾
        </div>
        <div className="absolute bottom-28 right-12 text-4xl -rotate-12">
          🦴
        </div>
      </div>
    </section>
  );
}
