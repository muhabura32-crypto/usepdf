import type { Metadata } from 'next'
import BlogContent from './blog-content'

export const metadata: Metadata = {
  title: 'Blog - PDF Tips & Tutorials | UsePDF',
  description: 'Learn how to use PDF tools effectively. Read tutorials, tips, and guides for merging, compressing, and converting PDFs.',
  keywords: ['PDF guide', 'PDF tutorial', 'PDF tips', 'PDF help', 'how to merge PDF', 'how to compress PDF'],
}

export default function BlogPage() {
  return <BlogContent />
}
