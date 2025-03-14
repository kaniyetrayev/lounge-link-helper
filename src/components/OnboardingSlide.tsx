
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  children?: ReactNode;
}

const OnboardingSlide = ({
  title,
  description,
  image,
  isActive,
  children
}: OnboardingSlideProps) => {
  return (
    <div 
      className={cn(
        "absolute inset-0 flex flex-col items-center px-6 pb-24 pt-16 transition-opacity duration-500",
        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
      )}
    >
      <div className="h-[45vh] w-full relative mb-8 overflow-hidden rounded-2xl">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-8">{description}</p>
        {children}
      </div>
    </div>
  );
};

export default OnboardingSlide;
