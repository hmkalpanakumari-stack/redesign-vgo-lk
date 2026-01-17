export interface Banner {
  id: string
  title: string
  subtitle: string
  description?: string
  image: string
  ctaText: string
  ctaLink: string
  backgroundColor?: string
}

export interface FeatureItem {
  id: string
  icon: string
  title: string
  description: string
}

export const heroBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'New Year Sale',
    subtitle: 'Up to 50% Off',
    description: 'Start the year with amazing deals on electronics, fashion, and more!',
    image: 'https://picsum.photos/seed/banner1/1920/600',
    ctaText: 'Shop Now',
    ctaLink: '/products?sale=true',
    backgroundColor: '#FF6B35',
  },
  {
    id: 'banner-2',
    title: 'Latest iPhones',
    subtitle: 'iPhone 15 Series',
    description: 'Experience the most powerful iPhone ever with the A17 Pro chip',
    image: 'https://picsum.photos/seed/banner2/1920/600',
    ctaText: 'Explore',
    ctaLink: '/products/smartphones',
    backgroundColor: '#004E89',
  },
  {
    id: 'banner-3',
    title: 'Fashion Week',
    subtitle: 'New Arrivals',
    description: 'Discover the latest trends in fashion for men and women',
    image: 'https://picsum.photos/seed/banner3/1920/600',
    ctaText: 'View Collection',
    ctaLink: '/products/fashion',
    backgroundColor: '#1A1A1A',
  },
]

export const promoBanners: Banner[] = [
  {
    id: 'promo-1',
    title: 'Electronics',
    subtitle: 'Up to 30% Off',
    image: 'https://picsum.photos/seed/promo1/600/300',
    ctaText: 'Shop',
    ctaLink: '/products/electronics',
  },
  {
    id: 'promo-2',
    title: 'Home & Living',
    subtitle: 'New Collection',
    image: 'https://picsum.photos/seed/promo2/600/300',
    ctaText: 'Explore',
    ctaLink: '/products/home-living',
  },
]

export const features: FeatureItem[] = [
  {
    id: 'feature-1',
    icon: '🚚',
    title: 'Free Delivery',
    description: 'On orders above Rs. 5,000',
  },
  {
    id: 'feature-2',
    icon: '🔄',
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    id: 'feature-3',
    icon: '🔒',
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    id: 'feature-4',
    icon: '💬',
    title: '24/7 Support',
    description: 'Dedicated customer support',
  },
]

export const announcementBar = {
  message: '🎉 Free delivery on orders above Rs. 5,000 | Use code WELCOME10 for 10% off your first order!',
  link: '/products',
  linkText: 'Shop Now',
}

export const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/returns' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    { label: 'Facebook', href: 'https://facebook.com/vgolk', icon: 'facebook' },
    { label: 'Instagram', href: 'https://instagram.com/vgolk', icon: 'instagram' },
    { label: 'Twitter', href: 'https://twitter.com/vgolk', icon: 'twitter' },
    { label: 'YouTube', href: 'https://youtube.com/vgolk', icon: 'youtube' },
  ],
}

export const contactInfo = {
  phone: '+94 11 234 5678',
  email: 'support@vgo.lk',
  address: '123 Galle Road, Colombo 03, Sri Lanka',
  hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
}

export const flashSaleConfig = {
  title: 'Flash Deals',
  subtitle: 'Grab them before they\'re gone!',
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
}
