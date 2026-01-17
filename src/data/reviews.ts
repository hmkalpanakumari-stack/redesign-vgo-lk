import type { Review } from '@/types/order'

export const reviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-2',
    userName: 'Nimal Silva',
    userAvatar: 'https://picsum.photos/seed/user2/50/50',
    rating: 5,
    title: 'Best iPhone ever!',
    comment: 'Absolutely love this phone. The camera quality is incredible, especially the night mode. Battery life is amazing - easily lasts all day. The titanium design feels premium and lighter than previous models.',
    images: [
      'https://picsum.photos/seed/rev1-1/200/200',
      'https://picsum.photos/seed/rev1-2/200/200',
    ],
    isVerifiedPurchase: true,
    helpfulCount: 45,
    createdAt: '2024-01-12T10:00:00Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userId: 'user-3',
    userName: 'Kamini Fernando',
    rating: 4,
    title: 'Great but expensive',
    comment: 'The phone is fantastic with excellent performance and camera. Only downside is the price, but if you can afford it, it\'s worth every rupee.',
    isVerifiedPurchase: true,
    helpfulCount: 23,
    createdAt: '2024-01-14T15:30:00Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-1',
    userId: 'user-4',
    userName: 'Ruwan Jayawardena',
    userAvatar: 'https://picsum.photos/seed/user4/50/50',
    rating: 5,
    title: 'Perfect for photography',
    comment: 'As a professional photographer, I\'m amazed by the camera capabilities. The ProRAW feature gives me so much control over my shots. Fast delivery from VGO too!',
    images: [
      'https://picsum.photos/seed/rev3-1/200/200',
    ],
    isVerifiedPurchase: true,
    helpfulCount: 67,
    createdAt: '2024-01-16T09:15:00Z',
  },
  {
    id: 'rev-4',
    productId: 'prod-4',
    userId: 'user-5',
    userName: 'Priya Mendis',
    rating: 5,
    title: 'Best noise cancelling headphones',
    comment: 'The noise cancellation is phenomenal. I use these daily for work calls and music. Very comfortable for long hours of use. Worth the investment.',
    isVerifiedPurchase: true,
    helpfulCount: 89,
    createdAt: '2024-01-08T11:00:00Z',
  },
  {
    id: 'rev-5',
    productId: 'prod-4',
    userId: 'user-6',
    userName: 'Ashan Kumara',
    userAvatar: 'https://picsum.photos/seed/user6/50/50',
    rating: 4,
    title: 'Excellent sound quality',
    comment: 'Amazing sound quality and ANC. Only giving 4 stars because the touch controls are a bit sensitive. Otherwise perfect headphones.',
    isVerifiedPurchase: true,
    helpfulCount: 34,
    createdAt: '2024-01-10T14:20:00Z',
  },
  {
    id: 'rev-6',
    productId: 'prod-5',
    userId: 'user-7',
    userName: 'Dinesh Rajapaksa',
    rating: 5,
    title: 'Great quality for the price',
    comment: 'Bought 5 of these for my team. Excellent quality cotton, comfortable fit. Will definitely order more. Great for bulk purchases!',
    isVerifiedPurchase: true,
    helpfulCount: 56,
    createdAt: '2024-01-05T16:45:00Z',
  },
  {
    id: 'rev-7',
    productId: 'prod-8',
    userId: 'user-8',
    userName: 'Sanduni Perera',
    userAvatar: 'https://picsum.photos/seed/user8/50/50',
    rating: 5,
    title: 'Perfect for daily yoga',
    comment: 'Non-slip surface works great even during hot yoga sessions. Good thickness provides cushioning for knees. The purple color is beautiful!',
    images: [
      'https://picsum.photos/seed/rev7-1/200/200',
    ],
    isVerifiedPurchase: true,
    helpfulCount: 78,
    createdAt: '2024-01-07T08:30:00Z',
  },
  {
    id: 'rev-8',
    productId: 'prod-10',
    userId: 'user-9',
    userName: 'Lalith De Silva',
    rating: 5,
    title: 'Authentic Ceylon Tea taste',
    comment: 'This is the real deal! Authentic Sri Lankan tea flavor. I\'ve been buying this for months now. Great value for 100 bags.',
    isVerifiedPurchase: true,
    helpfulCount: 123,
    createdAt: '2024-01-03T07:15:00Z',
  },
  {
    id: 'rev-9',
    productId: 'prod-14',
    userId: 'user-10',
    userName: 'Malini Gunasekara',
    userAvatar: 'https://picsum.photos/seed/user10/50/50',
    rating: 4,
    title: 'Healthy cooking made easy',
    comment: 'Makes crispy food with less oil. The digital controls are easy to use. Only minor issue is it takes some trial to get perfect results.',
    isVerifiedPurchase: true,
    helpfulCount: 45,
    createdAt: '2024-01-11T13:00:00Z',
  },
  {
    id: 'rev-10',
    productId: 'prod-20',
    userId: 'user-11',
    userName: 'Saman Wickramasinghe',
    rating: 5,
    title: 'Pure Sri Lankan honey',
    comment: 'The best honey I\'ve tasted! You can tell it\'s pure and natural. Great for my morning tea. Will keep ordering this.',
    isVerifiedPurchase: true,
    helpfulCount: 156,
    createdAt: '2024-01-02T10:30:00Z',
  },
]

export function getProductReviews(productId: string): Review[] {
  return reviews.filter(r => r.productId === productId)
}

export function getAverageRating(productId: string): number {
  const productReviews = getProductReviews(productId)
  if (productReviews.length === 0) return 0
  const sum = productReviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / productReviews.length) * 10) / 10
}

export function getRatingDistribution(productId: string): Record<number, number> {
  const productReviews = getProductReviews(productId)
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  productReviews.forEach(r => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1
  })
  return distribution
}
