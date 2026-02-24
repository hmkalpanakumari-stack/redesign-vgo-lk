import type { Category } from '@/types/product'

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronics',
    imageUrl: 'https://picsum.photos/seed/electronics/400/300',
    icon: '📱',
    productCount: 245,
    children: [
      { id: 'cat-1-1', name: 'Smartphones', slug: 'smartphones', parentId: 'cat-1', productCount: 89 },
      { id: 'cat-1-2', name: 'Laptops', slug: 'laptops', parentId: 'cat-1', productCount: 56 },
      { id: 'cat-1-3', name: 'Tablets', slug: 'tablets', parentId: 'cat-1', productCount: 34 },
      { id: 'cat-1-4', name: 'Accessories', slug: 'electronics-accessories', parentId: 'cat-1', productCount: 66 },
    ],
  },
  {
    id: 'cat-2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    imageUrl: 'https://picsum.photos/seed/fashion/400/300',
    icon: '👕',
    productCount: 312,
    children: [
      { id: 'cat-2-1', name: "Men's Clothing", slug: 'mens-clothing', parentId: 'cat-2', productCount: 98 },
      { id: 'cat-2-2', name: "Women's Clothing", slug: 'womens-clothing', parentId: 'cat-2', productCount: 124 },
      { id: 'cat-2-3', name: 'Shoes', slug: 'shoes', parentId: 'cat-2', productCount: 56 },
      { id: 'cat-2-4', name: 'Accessories', slug: 'fashion-accessories', parentId: 'cat-2', productCount: 34 },
    ],
  },
  {
    id: 'cat-3',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture and home decor',
    imageUrl: 'https://picsum.photos/seed/home/400/300',
    icon: '🏠',
    productCount: 189,
    children: [
      { id: 'cat-3-1', name: 'Furniture', slug: 'furniture', parentId: 'cat-3', productCount: 67 },
      { id: 'cat-3-2', name: 'Kitchen', slug: 'kitchen', parentId: 'cat-3', productCount: 45 },
      { id: 'cat-3-3', name: 'Bedding', slug: 'bedding', parentId: 'cat-3', productCount: 38 },
      { id: 'cat-3-4', name: 'Decor', slug: 'decor', parentId: 'cat-3', productCount: 39 },
    ],
  },
  {
    id: 'cat-4',
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Sports equipment and fitness gear',
    imageUrl: 'https://picsum.photos/seed/sports/400/300',
    icon: '⚽',
    productCount: 156,
    children: [
      { id: 'cat-4-1', name: 'Exercise Equipment', slug: 'exercise-equipment', parentId: 'cat-4', productCount: 42 },
      { id: 'cat-4-2', name: 'Sports Gear', slug: 'sports-gear', parentId: 'cat-4', productCount: 58 },
      { id: 'cat-4-3', name: 'Outdoor', slug: 'outdoor', parentId: 'cat-4', productCount: 34 },
      { id: 'cat-4-4', name: 'Sportswear', slug: 'sportswear', parentId: 'cat-4', productCount: 22 },
    ],
  },
  {
    id: 'cat-5',
    name: 'Beauty & Health',
    slug: 'beauty-health',
    description: 'Cosmetics and wellness products',
    imageUrl: 'https://picsum.photos/seed/beauty/400/300',
    icon: '💄',
    productCount: 203,
    children: [
      { id: 'cat-5-1', name: 'Skincare', slug: 'skincare', parentId: 'cat-5', productCount: 67 },
      { id: 'cat-5-2', name: 'Makeup', slug: 'makeup', parentId: 'cat-5', productCount: 54 },
      { id: 'cat-5-3', name: 'Hair Care', slug: 'hair-care', parentId: 'cat-5', productCount: 43 },
      { id: 'cat-5-4', name: 'Health', slug: 'health', parentId: 'cat-5', productCount: 39 },
    ],
  },
  {
    id: 'cat-6',
    name: 'Groceries',
    slug: 'groceries',
    description: 'Daily essentials and food items',
    imageUrl: 'https://picsum.photos/seed/groceries/400/300',
    icon: '🛒',
    productCount: 287,
    children: [
      { id: 'cat-6-1', name: 'Fresh Food', slug: 'fresh-food', parentId: 'cat-6', productCount: 78 },
      { id: 'cat-6-2', name: 'Beverages', slug: 'beverages', parentId: 'cat-6', productCount: 56 },
      { id: 'cat-6-3', name: 'Snacks', slug: 'snacks', parentId: 'cat-6', productCount: 89 },
      { id: 'cat-6-4', name: 'Household', slug: 'household', parentId: 'cat-6', productCount: 64 },
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
