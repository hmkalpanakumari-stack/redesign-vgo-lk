import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { heroBanners } from '@/data/content'
import { Button } from '@/components/ui/Button'

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroBanners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroBanners.length) % heroBanners.length)
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroBanners.length)
  }

  return (
    <section className="relative overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroBanners.map((banner) => (
          <div
            key={banner.id}
            className="w-full flex-shrink-0 relative"
            style={{ backgroundColor: banner.backgroundColor }}
          >
            <div className="container relative">
              <div className="grid md:grid-cols-2 gap-8 items-center min-h-[400px] md:min-h-[500px] py-8">
                {/* Content */}
                <div className="text-white z-10 order-2 md:order-1">
                  <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                    {banner.subtitle}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {banner.title}
                  </h1>
                  {banner.description && (
                    <p className="text-lg text-white/80 mb-6 max-w-lg">
                      {banner.description}
                    </p>
                  )}
                  <Link to={banner.ctaLink}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="bg-white text-dark hover:bg-gray-100"
                    >
                      {banner.ctaText}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Button>
                  </Link>
                </div>

                {/* Image */}
                <div className="relative order-1 md:order-2">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-64 md:h-96 object-cover rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
