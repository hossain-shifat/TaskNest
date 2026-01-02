import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = ({
    slides,
    autoPlay = true,
    autoPlayInterval = 5000,
    onSlideChange,
    renderSlide
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timeoutRef = useRef(null);

    const totalSlides = slides.length;

    const goToSlide = (index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(index);

        if (onSlideChange) {
            onSlideChange(index);
        }

        setTimeout(() => setIsTransitioning(false), 600);
    };

    const nextSlide = () => {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    };

    const prevSlide = () => {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prev);
    };

    useEffect(() => {
        if (!autoPlay) return;

        timeoutRef.current = setTimeout(() => {
            nextSlide();
        }, autoPlayInterval);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentSlide, autoPlay, autoPlayInterval]);

    return (
        <div className="w-full">
            {/* Slides Container */}
            <div className="relative w-full overflow-hidden bg-base-200 rounded-box">
                <div className="relative w-full">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`w-full transition-opacity duration-600 ${index === currentSlide ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
                                }`}
                        >
                            {renderSlide ? renderSlide(slide, index) : (
                                <div className="w-full h-full">{slide}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Controls - Below Image */}
            <div className="flex items-center justify-center gap-6 mt-6">
                {/* Previous Button */}
                <button
                    onClick={prevSlide}
                    disabled={isTransitioning}
                    className="btn btn-circle btn-primary hover:scale-110 transition-transform disabled:opacity-50"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Pagination Dots */}
                <div className="flex gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            disabled={isTransitioning}
                            className={`transition-all duration-300 rounded-full ${index === currentSlide
                                    ? 'w-10 h-3 bg-primary'
                                    : 'w-3 h-3 bg-base-300 hover:bg-primary/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === currentSlide ? 'true' : 'false'}
                        />
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    disabled={isTransitioning}
                    className="btn btn-circle btn-primary hover:scale-110 transition-transform disabled:opacity-50"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default Slider
