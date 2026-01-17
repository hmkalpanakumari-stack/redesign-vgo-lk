import { Link } from 'react-router-dom'
import { promoBanners } from '@/data/content'
import { Button } from '@/components/ui/Button'

export function PromoBanners() {
  return (
    <section className="py-8 bg-light-bg">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6">
          {promoBanners.map(banner => (
            <Link
              key={banner.id}
              to={banner.ctaLink}
              className="relative overflow-hidden rounded-xl group"
            >
              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-6 text-white">
                <span className="text-sm font-medium text-white/80 mb-1">
                  {banner.subtitle}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {banner.title}
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-fit bg-white text-dark hover:bg-gray-100"
                >
                  {banner.ctaText}
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
