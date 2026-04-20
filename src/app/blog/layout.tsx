import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - PDF Tips & Tutorials | UsePDF',
  description: 'Learn how to use PDF tools effectively. Read tutorials, tips, and guides for merging, compressing, and converting PDFs.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://usepdf.xyz/blog',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
