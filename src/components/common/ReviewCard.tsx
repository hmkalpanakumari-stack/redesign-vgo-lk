import type { Review } from '@/types/order'
import { formatRelativeTime } from '@/utils/formatters'
import { Rating } from '@/components/ui/Rating'
import { Badge } from '@/components/ui/Badge'

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className = '' }: ReviewCardProps) {
  return (
    <div className={`border-b border-light-border pb-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-orange/10 flex items-center justify-center">
              <span className="text-primary-orange font-medium">
                {review.userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-dark">{review.userName}</span>
              {review.isVerifiedPurchase && (
                <Badge variant="success" size="sm">
                  Verified Purchase
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Rating value={review.rating} size="sm" />
              <span className="text-xs text-dark-muted">
                {formatRelativeTime(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-medium text-dark mb-2">{review.title}</h4>
      )}

      {/* Comment */}
      <p className="text-dark-secondary text-sm leading-relaxed">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center gap-4 mt-4">
        <button className="flex items-center gap-1 text-sm text-dark-muted hover:text-primary-orange transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>Helpful ({review.helpfulCount})</span>
        </button>
        <button className="text-sm text-dark-muted hover:text-error transition-colors">
          Report
        </button>
      </div>
    </div>
  )
}

interface ReviewListProps {
  reviews: Review[]
  className?: string
}

export function ReviewList({ reviews, className = '' }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-dark-muted">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}

interface ReviewSummaryProps {
  rating: number
  reviewCount: number
  distribution: Record<number, number>
  className?: string
}

export function ReviewSummary({
  rating,
  reviewCount,
  distribution,
  className = '',
}: ReviewSummaryProps) {
  const maxCount = Math.max(...Object.values(distribution))

  return (
    <div className={`flex gap-8 ${className}`}>
      {/* Overall Rating */}
      <div className="text-center">
        <div className="text-5xl font-bold text-dark mb-2">{rating.toFixed(1)}</div>
        <Rating value={rating} size="md" />
        <p className="text-sm text-dark-muted mt-2">
          Based on {reviewCount.toLocaleString()} reviews
        </p>
      </div>

      {/* Distribution */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map(stars => {
          const count = distribution[stars] || 0
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

          return (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-sm text-dark-muted w-3">{stars}</span>
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-dark-muted w-8 text-right">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
