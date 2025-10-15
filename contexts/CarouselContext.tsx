import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CarouselState {
  activeSlide: number;
  isManualScrolling: boolean;
}

interface CarouselContextType {
  carouselState: CarouselState;
  setActiveSlide: (index: number) => void;
  setIsManualScrolling: (isScrolling: boolean) => void;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export function CarouselProvider({ children }: { children: ReactNode }) {
  const [carouselState, setCarouselState] = useState<CarouselState>({
    activeSlide: 0,
    isManualScrolling: false,
  });

  const setActiveSlide = (index: number) => {
    setCarouselState((prev) => ({ ...prev, activeSlide: index }));
  };

  const setIsManualScrolling = (isScrolling: boolean) => {
    setCarouselState((prev) => ({ ...prev, isManualScrolling: isScrolling }));
  };

  return (
    <CarouselContext.Provider value={{ carouselState, setActiveSlide, setIsManualScrolling }}>
      {children}
    </CarouselContext.Provider>
  );
}

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (context === undefined) {
    throw new Error('useCarousel must be used within a CarouselProvider');
  }
  return context;
}
