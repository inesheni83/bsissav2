import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeroImage = {
    id: number;
    name: string;
    image_url: string | null;
};

type HeroCarouselProps = {
    images: HeroImage[];
    autoPlayInterval?: number;
    className?: string;
};

export default function HeroCarousel({
    images,
    autoPlayInterval = 5000,
    className = ''
}: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || images.length <= 1) return;

        const interval = setInterval(goToNext, autoPlayInterval);
        return () => clearInterval(interval);
    }, [isAutoPlaying, autoPlayInterval, goToNext, images.length]);

    // Preload images
    useEffect(() => {
        images.forEach((image) => {
            if (image.image_url) {
                const img = new Image();
                img.src = image.image_url;
            }
        });
    }, [images]);

    if (images.length === 0) {
        return (
            <div className={`relative w-full bg-gradient-to-br from-emerald-50 to-emerald-100 ${className}`}>
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <p className="text-gray-500 text-lg">Aucune image disponible</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative w-full overflow-hidden bg-gray-900 group ${className}`}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Images Container */}
            <div className="relative w-full h-full">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            index === currentIndex
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-105'
                        }`}
                    >
                        {image.image_url ? (
                            <img
                                src={image.image_url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                <span className="text-white text-2xl font-semibold">
                                    {image.name}
                                </span>
                            </div>
                        )}
                        {/* Overlay gradient for better text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows - only show if more than 1 image */}
            {images.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-12 w-12 rounded-full shadow-lg"
                        aria-label="Image précédente"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-12 w-12 rounded-full shadow-lg"
                        aria-label="Image suivante"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </>
            )}

            {/* Dots Navigation - only show if more than 1 image */}
            {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentIndex
                                    ? 'bg-white w-8 h-2'
                                    : 'bg-white/50 hover:bg-white/75 w-2 h-2'
                            }`}
                            aria-label={`Aller à l'image ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
                <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
}
