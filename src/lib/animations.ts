
import { cn } from "@/lib/utils";

export const fadeIn = (delay?: string) => {
  return cn(
    "opacity-0 animate-fade-in",
    delay && `animation-delay-${delay}`
  );
};

export const slideUp = (delay?: number) => {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0],
        delay: delay || 0
      }
    }
  };
};

export const staggeredChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};
