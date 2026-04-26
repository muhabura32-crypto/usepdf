'use client'

import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'

const blogPosts = [
  {
    slug: 'how-to-merge-pdfs',
    title: 'How to Merge PDFs: A Complete Guide',
    excerpt: 'Learn the best ways to combine multiple PDF files into one document, with step-by-step instructions.',
    date: '2024-04-15',
    author: 'Jane Smith',
    category: 'Tutorial',
    readTime: '5 min read',
  },
  {
    slug: 'compress-pdf-without-losing-quality',
    title: 'How to Compress PDFs Without Losing Quality',
    excerpt: 'Discover techniques to reduce PDF file size while maintaining professional appearance and readability.',
    date: '2024-04-10',
    author: 'John Doe',
    category: 'Tips & Tricks',
    readTime: '4 min read',
  },
  {
    slug: 'pdf-security-best-practices',
    title: 'PDF Security: Best Practices for 2024',
    excerpt: 'Essential security tips to protect your sensitive PDFs and ensure your data privacy.',
    date: '2024-04-05',
    author: 'Sarah Johnson',
    category: 'Security',
    readTime: '6 min read',
  },
  {
    slug: 'convert-pdf-to-images',
    title: 'Converting PDFs to Images: Complete Guide',
    excerpt: 'Everything you need to know about converting PDF pages to JPG, PNG, and other image formats.',
    date: '2024-03-30',
    author: 'Mike Chen',
    category: 'Tutorial',
    readTime: '5 min read',
  },
]

export default function BlogContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 dark:text-primary-400" />
              <span>UsePDF Blog</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Tips, tutorials, and insights about PDF tools and best practices
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-custom">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full"
              >
                {/* Image */}
                <div className="h-40 sm:h-48 bg-gradient-to-br from-primary-400 to-secondary-400 overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 opacity-20 group-hover:opacity-30 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                      {post.category}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-grow">
                    {post.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 flex-wrap gap-3">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="hidden xs:inline">{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <User className="w-4 h-4" />
                        <span className="hidden xs:inline">{post.author}</span>
                      </div>
                    </div>
                    <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button className="btn-primary px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
              Load More Articles
            </button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-700">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto text-white"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              Stay Updated
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90">
              Get the latest PDF tips, tutorials, and announcements delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-gray-900 dark:text-white bg-white/20 placeholder-white/70 border border-white/30 focus:outline-none focus:border-white text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-primary-600 dark:text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
