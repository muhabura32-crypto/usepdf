'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ThumbsUp, Flag, User } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface RatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function Rating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className = ''
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  const handleMouseEnter = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starRating = i + 1
        const isFilled = starRating <= displayRating
        const isPartial = starRating - 0.5 <= displayRating && displayRating < starRating

        return (
          <motion.button
            key={i}
            type="button"
            className={`${sizeClasses[size]} ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => handleClick(starRating)}
            onMouseEnter={() => handleMouseEnter(starRating)}
            onMouseLeave={handleMouseLeave}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            disabled={!interactive}
          >
            <Star
              className={`${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : isPartial
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'fill-gray-200 text-gray-300 dark:fill-gray-600 dark:text-gray-500'
              } transition-colors`}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  review: string
  date: string
  verified: boolean
  helpful: number
  toolName?: string
}

interface ReviewCardProps {
  review: Review
  onHelpful?: (reviewId: string) => void
  onReport?: (reviewId: string) => void
}

export function ReviewCard({ review, onHelpful, onReport }: ReviewCardProps) {
  const { t } = useLanguage()

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            {review.userAvatar ? (
              <Image
                src={review.userAvatar}
                alt={review.userName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {review.userName}
              </span>
              {review.verified && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                  {t('verifiedUser')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Rating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {review.review}
      </p>

      {review.toolName && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Tool: {review.toolName}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => onHelpful?.(review.id)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{t('helpful')} ({review.helpful})</span>
        </button>

        <button
          onClick={() => onReport?.(review.id)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Flag className="w-4 h-4" />
          <span>{t('report')}</span>
        </button>
      </div>
    </motion.div>
  )
}

interface ReviewSectionProps {
  averageRating?: number
  totalReviews?: number
  reviews?: Review[]
  className?: string
}

export function ReviewSection({
  averageRating = 4.9,
  totalReviews = 1250,
  reviews = [],
  className = ''
}: ReviewSectionProps) {
  const { t } = useLanguage()
  const [showAllReviews, setShowAllReviews] = useState(false)

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  return (
    <section className={`py-16 bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="container-custom">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('customerReviews')}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Rating rating={averageRating} size="lg" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {averageRating}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              ({totalReviews.toLocaleString()} {t('reviews')})
            </span>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpful={(id) => console.log('Helpful:', id)}
              onReport={(id) => console.log('Report:', id)}
            />
          ))}
        </div>

        {reviews.length > 3 && (
          <div className="text-center">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="btn-secondary"
            >
              {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// Sample reviews data
export const sampleReviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    rating: 5,
    review: 'Excellent tool! Fast, secure, and exactly what I needed. The interface is intuitive and the results are perfect.',
    date: '2024-04-15',
    verified: true,
    helpful: 24,
    toolName: 'Merge PDF'
  },
  {
    id: '2',
    userName: 'Michael Chen',
    rating: 5,
    review: 'Been using this for months. Never fails. The compression quality is amazing and it\'s completely free.',
    date: '2024-04-12',
    verified: true,
    helpful: 18,
    toolName: 'Compress PDF'
  },
  {
    id: '3',
    userName: 'Emma Rodriguez',
    rating: 4,
    review: 'Great service! The conversion is quick and the quality is maintained. Only wish it supported more formats.',
    date: '2024-04-10',
    verified: true,
    helpful: 15,
    toolName: 'PDF to JPG'
  },
  {
    id: '4',
    userName: 'David Kim',
    rating: 5,
    review: 'Perfect for my workflow. No registration, no ads, just pure functionality. Highly recommended!',
    date: '2024-04-08',
    verified: true,
    helpful: 31,
    toolName: 'Split PDF'
  },
  {
    id: '5',
    userName: 'Lisa Thompson',
    rating: 5,
    review: 'The best PDF tool I\'ve used. Fast processing, great quality, and completely secure. Love it!',
    date: '2024-04-05',
    verified: true,
    helpful: 22,
    toolName: 'Rotate PDF'
  },
  {
    id: '6',
    userName: 'James Wilson',
    rating: 4,
    review: 'Very reliable tool. I use it daily for work. The interface could be a bit more modern but functionality is top-notch.',
    date: '2024-04-03',
    verified: true,
    helpful: 16,
    toolName: 'PDF to PNG'
  }
]
