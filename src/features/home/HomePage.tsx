import { HeroBanner } from './components/HeroBanner'
import { CategorySection } from './components/CategorySection'
import { FlashDeals } from './components/FlashDeals'
import { FeaturedProducts } from './components/FeaturedProducts'
import { FeaturesSection } from './components/FeaturesSection'
import { PromoBanners } from './components/PromoBanners'

export function HomePage() {
  return (
    <div>
      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Categories Section */}
      <CategorySection />

      {/* Flash Deals Section */}
      <FlashDeals />

      {/* Promo Banners */}
      <PromoBanners />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Features/Benefits Section */}
      <FeaturesSection />
    </div>
  )
}
