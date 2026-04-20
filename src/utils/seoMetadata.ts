import type { Metadata } from 'next'

export interface ToolMetadataConfig {
  title: string
  description: string
  keywords: string[]
  path: string
  features: string[]
}

export function generateToolMetadata(config: ToolMetadataConfig): Metadata {
  const baseUrl = 'https://usepdf.xyz'
  const fullUrl = `${baseUrl}${config.path}`

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: fullUrl,
      siteName: 'UsePDF',
      title: config.title,
      description: config.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      creator: '@usepdfxyz',
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  }
}

// Tool-specific configurations
export const toolMetadataConfigs = {
  mergePdf: {
    title: 'Merge PDF Online - Combine Multiple PDFs for Free | UsePDF',
    description: 'Merge multiple PDF files into one document instantly. Free online PDF merger tool. No registration needed. 100% secure and private. Works in browser.',
    keywords: ['merge PDF', 'combine PDF', 'merge PDF files', 'PDF merger', 'join PDF', 'combine PDFs free', 'online PDF merger'],
    path: '/merge-pdf',
    features: [
      'Merge unlimited PDFs',
      'Drag and drop interface',
      'Reorder PDF files',
      'No file size limits',
      'No registration required',
      'Secure 100% client-side processing',
    ],
  },
  compressPdf: {
    title: 'Compress PDF Online - Reduce File Size for Free | UsePDF',
    description: 'Compress PDF files and reduce their size while maintaining quality. Free online PDF compressor. No signup needed. Fast and secure compression.',
    keywords: ['compress PDF', 'reduce PDF size', 'PDF compressor', 'compress PDF online', 'PDF size reducer', 'small PDF size', 'optimize PDF'],
    path: '/compress-pdf',
    features: [
      'Reduce PDF file size',
      'Maintain document quality',
      'Multiple compression levels',
      'No file size restrictions',
      'Instant processing',
      'Privacy guaranteed',
    ],
  },
  splitPdf: {
    title: 'Split PDF Online - Extract Pages for Free | UsePDF',
    description: 'Split PDF files and extract specific pages instantly. Free online PDF splitter tool. No registration required. Secure and reliable.',
    keywords: ['split PDF', 'extract PDF pages', 'PDF splitter', 'separate PDF pages', 'divide PDF', 'extract pages from PDF'],
    path: '/split-pdf',
    features: [
      'Split PDFs into individual pages',
      'Extract specific page ranges',
      'Batch page extraction',
      'No file size limits',
      'Instant results',
      'Secure processing',
    ],
  },
  rotatePdf: {
    title: 'Rotate PDF Online - Flip PDF Pages for Free | UsePDF',
    description: 'Rotate PDF pages 90, 180, or 270 degrees instantly. Free online PDF rotation tool. No signup needed. Fast and easy to use.',
    keywords: ['rotate PDF', 'flip PDF pages', 'PDF rotator', 'rotate PDF online', 'turn PDF pages', 'PDF page rotation'],
    path: '/rotate-pdf',
    features: [
      'Rotate pages 90/180/270 degrees',
      'Rotate all pages or specific pages',
      'Multiple rotation options',
      'Instant rotation',
      'No registration required',
      'Completely free',
    ],
  },
  pdfToJpg: {
    title: 'Convert PDF to JPG Online - Free PDF to Image Converter | UsePDF',
    description: 'Convert PDF pages to JPG images instantly. Free online PDF to JPG converter. No signup. Perfect quality conversion. Download high-resolution images.',
    keywords: ['PDF to JPG', 'convert PDF to JPG', 'PDF to image', 'PDF to picture', 'PDF converter', 'convert PDF to JPEG'],
    path: '/pdf-to-jpg',
    features: [
      'Convert PDF to JPG format',
      'High-quality image conversion',
      'Batch conversion support',
      'Adjustable quality settings',
      'No file size limits',
      'Fast processing',
    ],
  },
  pdfToPng: {
    title: 'Convert PDF to PNG Online - Free PDF to PNG Converter | UsePDF',
    description: 'Convert PDF pages to PNG images with transparent backgrounds. Free online PDF to PNG converter. No registration. Instant conversion.',
    keywords: ['PDF to PNG', 'convert PDF to PNG', 'PDF to image', 'PDF converter', 'PNG conversion', 'transparent PNG from PDF'],
    path: '/pdf-to-png',
    features: [
      'Convert PDF to PNG format',
      'Transparent background support',
      'High-resolution images',
      'Batch processing',
      'No file restrictions',
      'Instant results',
    ],
  },
}

// FAQ structured data for tool pages
export function generateToolFAQSchema(toolName: string) {
  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    mergePdf: [
      {
        question: 'How do I merge PDF files online?',
        answer: `Simply upload your PDF files to UsePDF's merge tool, arrange them in the desired order, and click "Merge". Your merged PDF will be ready for download instantly.`,
      },
      {
        question: 'Is the PDF merge tool free?',
        answer: 'Yes, UsePDF merge tool is completely free. No registration or payment is required.',
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes, all processing happens on your browser (client-side). We do not upload or store your files on any server.',
      },
      {
        question: 'Can I merge large PDF files?',
        answer: 'Yes, there are no file size restrictions. You can merge PDFs of any size.',
      },
    ],
    compressPdf: [
      {
        question: 'How much can I compress a PDF?',
        answer: 'Compression ratio depends on the PDF content. You can choose different compression levels for optimal results.',
      },
      {
        question: 'Will compression reduce quality?',
        answer: 'Our compression tool is optimized to maintain quality while reducing file size. You can select your preferred quality level.',
      },
      {
        question: 'Is the compression free?',
        answer: 'Yes, PDF compression is completely free with no hidden charges or registration needed.',
      },
    ],
    splitPdf: [
      {
        question: 'How do I extract pages from a PDF?',
        answer: 'Upload your PDF, specify which pages you want to extract, and click "Split". Your extracted PDF will be ready for download.',
      },
      {
        question: 'Can I split all pages separately?',
        answer: 'Yes, you can split a PDF into individual pages, with each page as a separate file.',
      },
    ],
  }

  return faqs[toolName] || faqs.mergePdf
}
