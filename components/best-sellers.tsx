'use client'

import React, { useRef, useState, useTransition } from 'react'
import { ProductImage } from '@/components/product-image'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TextRotate } from '@/components/ui/text-rotate'
import { useCart } from '@/hooks/use-cart'
import { RatingStars } from '@/components/rating-stars'
import { PawLoader } from '@/components/paw-loader'

export type PricingPlan = {
  name: string;
  price: number;
  imageSrc: string;
  features: string[];
  isPopular?: boolean;
  accent: string;
  slug: string;
  merchandiseId: string | null;
  availableForSale?: boolean;
  onSale?: boolean;
  comparePrice?: number;
  rating: number;
  reviewCount: number;
};

interface PricingProps {
  title?: string;
  plans: PricingPlan[];
  className?: string;
}

// Counter Component
const Counter = ({ from, to }: { from: number; to: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(from, to, {
      duration: 1,
      onUpdate(value) {
        node.textContent = value.toFixed(0);
      },
    });
    return () => controls.stop();
  }, [from, to]);
  return <span ref={nodeRef} />;
};

// Header Component
const PricingHeader = () => (
  <div className="text-center mb-10 sm:mb-14 relative z-10 max-w-3xl mx-auto px-4 select-none">
    {/* "Shop" Header immediately above The Best Sellers with Underline and Spacing */}
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col items-center mb-6"
    >
      <span className="font-attahost text-4xl sm:text-5xl text-black tracking-wide font-normal">
        Shop
      </span>
      {/* Centered wavy line that is slightly shorter and curves beautifully */}
      <svg width="36" height="6" viewBox="0 0 36 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-2 text-black">
        <motion.path
          d="M1 3.5C4.5 3.5 6.5 1.5 10 1.5C13.5 1.5 15.5 5 19 5C22.5 5 24.5 1.5 28 1.5C31.5 1.5 33.5 3.5 35 3.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
    
    <h2 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight mb-4 flex items-center justify-center overflow-hidden py-2 select-none">
      <TextRotate
        texts={["The Best Sellers"]}
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
);

// Background Effects Component — static grid only. The 20 floating particles
// were 20 infinite RAF loops running while the section was mounted (even off
// screen); dropped for INP/idle-CPU. The grid is the same one they sat on.
const BackgroundEffects = () => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: "linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)",
    backgroundSize: "16px 16px"
  }} />
);

// Pricing Card Component
const PricingCard = ({
  plan,
  index
}: {
  plan: PricingPlan;
  index: number
}) => {
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    hasDragged.current = false;
  };

  const handleMouseMoveCard = (e: React.MouseEvent) => {
    // 1. Dynamic tilt effect
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      mouseX.set((e.clientX - centerX) / rect.width);
      mouseY.set((e.clientY - centerY) / rect.height);
    }

    // 2. Drag tracking
    const dx = Math.abs(e.clientX - dragStartPos.current.x);
    const dy = Math.abs(e.clientY - dragStartPos.current.y);
    if (dx > 8 || dy > 8) {
      hasDragged.current = true;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    if (!hasDragged.current) {
      // useTransition keeps isNavigating true until the destination is ready,
      // so the paw overlay shows for the whole client-side navigation.
      startNavigation(() => {
        router.push(`/products/${plan.slug}`);
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      key={plan.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMoveCard}
      onClick={handleClick}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="relative w-full h-[500px] flex flex-col justify-between bg-white rounded-xl p-5 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)] transition-all duration-200 select-none font-tbj-interval cursor-pointer"
    >
      {/* Navigation feedback — paw spinner while the product page loads */}
      {isNavigating && (
        <span
          aria-hidden="true"
          className="absolute inset-0 z-40 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-[1px] pointer-events-none"
        >
          <PawLoader size={56} count={4} />
        </span>
      )}

      {/* Best Seller / Sales Badge Sticker */}
      {plan.isPopular ? (
        <div className="absolute -top-3 -right-2 bg-[#ffea79] text-black border border-black px-2.5 py-1 rounded font-black text-[9px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none rotate-[3deg] z-20">
          Best Seller 🔥
        </div>
      ) : (plan.onSale && plan.comparePrice && plan.comparePrice > plan.price) ? (
        <div className="absolute -top-3 -right-2 bg-[#FF69B4] text-white border border-black px-2.5 py-1 rounded font-black text-[9px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none rotate-[-3deg] z-20">
          Sale 🏷️
        </div>
      ) : null}

      {/* Top Content Wrapper */}
      <div className="flex-1 flex flex-col justify-start">
        {/* Product Image */}
        <div className="w-full h-72 bg-white rounded-lg overflow-hidden relative mb-3 flex items-center justify-center p-3 flex-shrink-0">
          <ProductImage
            src={plan.imageSrc}
            alt={plan.name}
            width={400}
            height={400}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105 select-none pointer-events-none"
          />
        </div>

        {/* Plan Name and Popular Badge */}
        <div className="mb-2 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-black text-black mb-1 leading-snug truncate">{plan.name}</h3>
          
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <RatingStars rating={plan.rating} size="md" />
            {plan.rating > 0 && (
              <span className="text-xs font-black text-black ml-1.5 uppercase">
                {plan.rating.toFixed(1)} ({plan.reviewCount})
              </span>
            )}
          </div>

          {/* Price Display BELOW Star Ratings */}
          <div className="flex items-baseline gap-2 mt-2 select-none">
            <span className="text-2xl font-black text-black">${plan.price.toFixed(2)}</span>
            {plan.comparePrice && plan.comparePrice > plan.price && (
              <span className="text-base font-bold text-zinc-400 line-through">${plan.comparePrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          if (plan.merchandiseId && plan.availableForSale !== false) addToCart(plan.merchandiseId, 1, e.clientX, e.clientY);
        }}
        disabled={!plan.merchandiseId || plan.availableForSale === false}
        className="w-full py-3.5 rounded-lg bg-[#ffea79] text-black font-black text-base border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.9)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.9)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-auto disabled:opacity-60 disabled:cursor-not-allowed"
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{
          scale: 0.95,
          rotate: [-1, 1, 0],
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6.5" cy="11.5" r="2" />
          <circle cx="10" cy="7.5" r="2.2" />
          <circle cx="14" cy="7.5" r="2.2" />
          <circle cx="17.5" cy="11.5" r="2" />
          <path d="M12 13.5c-1.8 0-3.5 1-4 2.8-.4 1.3.2 2.7 1.5 3.2 1 .4 3 .5 5 0 1.3-.5 1.9-1.9 1.5-3.2-.5-1.8-2.2-2.8-4-2.8z" />
        </svg>
        <span>{plan.availableForSale === false ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
      </motion.button>
    </motion.div>
  );
};

// Main Container Component
export default function BestSellers({ title = "Best Seller", plans, className = "" }: PricingProps) {
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
    const walk = (x - startX.current) * 2.5; // Increased speed multiplier for lightning-fast responsiveness
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
    let currentVelocity = velocity.current * 16; // Initial swipe force
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
    <section className={`py-16 relative overflow-hidden bg-[#FAF6F0] border-y-2 border-black w-screen max-w-none left-1/2 right-1/2 -translate-x-1/2 select-none ${className}`}>
      <PricingHeader />
      <BackgroundEffects />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Drag Slider Container */}
      <div 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full max-w-[96%] mx-auto flex gap-6 overflow-x-auto py-6 px-4 z-10 relative cursor-grab active:cursor-grabbing hide-scrollbar"
      >
        {plans.map((plan, index) => (
          <div key={plan.name} className="w-[280px] sm:w-[320px] flex-shrink-0">
            <PricingCard
              plan={plan}
              index={index}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
