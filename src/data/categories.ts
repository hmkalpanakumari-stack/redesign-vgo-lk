import type { Category } from '@/types/product'

export const categories: Category[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets, smartphones, laptops, and electronic accessories',
    imageUrl: '/products/categories/electronics.jpg',
    icon: '📱',
    productCount: 0,
    children: [
      { id: '', name: 'Smartphones', slug: 'smartphones' },
      { id: '', name: 'Laptops', slug: 'laptops' },
      { id: '', name: 'Audio', slug: 'audio' },
      { id: '', name: 'Wearables', slug: 'wearables' },
      { id: '', name: 'Tablets', slug: 'tablets' },
      { id: '', name: 'Gaming', slug: 'gaming' },
      { id: '', name: 'Cameras', slug: 'cameras' },
      { id: '', name: 'Drones', slug: 'drones' },
    ],
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing, shoes, and accessories for men and women',
    imageUrl: '/products/categories/fashion.jpg',
    icon: '👕',
    productCount: 0,
    children: [
      { id: '', name: "Men's Clothing", slug: 'mens-clothing' },
      { id: '', name: "Women's Clothing", slug: 'womens-clothing' },
      { id: '', name: 'Shoes', slug: 'shoes' },
      { id: '', name: 'Watches', slug: 'watches' },
      { id: '', name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture, home decor, kitchen appliances, and bedding',
    imageUrl: '/products/categories/home-living.jpg',
    icon: '🏠',
    productCount: 0,
    children: [
      { id: '', name: 'Furniture', slug: 'furniture' },
      { id: '', name: 'Kitchen', slug: 'kitchen' },
      { id: '', name: 'Appliances', slug: 'appliances' },
      { id: '', name: 'Bedding', slug: 'bedding' },
      { id: '', name: 'Home Electronics', slug: 'home-electronics' },
    ],
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment, fitness gear, and outdoor adventure essentials',
    imageUrl: '/products/categories/sports.jpg',
    icon: '⚽',
    productCount: 0,
    children: [
      { id: '', name: 'Fitness', slug: 'fitness' },
      { id: '', name: 'Outdoor Gear', slug: 'outdoor-gear' },
      { id: '', name: 'Camping', slug: 'camping' },
    ],
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Beauty & Health',
    slug: 'beauty-health',
    description: 'Skincare, makeup, healthcare products, and personal care items',
    imageUrl: '/products/categories/beauty.jpg',
    icon: '💄',
    productCount: 0,
    children: [
      { id: '', name: 'Skincare', slug: 'skincare' },
      { id: '', name: 'Hair Care', slug: 'hair-care' },
      { id: '', name: 'Dental Care', slug: 'dental-care' },
      { id: '', name: 'Wellness', slug: 'wellness' },
    ],
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Toys & Games',
    slug: 'toys-games',
    description: 'Toys, board games, puzzles, and entertainment for all ages',
    imageUrl: '/products/categories/toys.jpg',
    icon: '🎮',
    productCount: 0,
    children: [
      { id: '', name: 'Building Sets', slug: 'building-sets' },
      { id: '', name: 'Board Games', slug: 'board-games' },
      { id: '', name: 'Drones', slug: 'toy-drones' },
      { id: '', name: 'Vehicles', slug: 'vehicles' },
    ],
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  for (const category of categories) {
    if (category.slug === slug) return category
    if (category.children) {
      const child = category.children.find(c => c.slug === slug)
      if (child) return child
    }
  }
  return undefined
}

export function getAllCategories(): Category[] {
  return categories
}

export function getMainCategories(): Category[] {
  return categories.filter(c => !c.parentId)
}
