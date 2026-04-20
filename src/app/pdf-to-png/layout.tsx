import type { Metadata } from 'next'
import { generateToolMetadata, toolMetadataConfigs } from '@/utils/seoMetadata'

export const metadata: Metadata = generateToolMetadata(toolMetadataConfigs.pdfToPng)

export default function PDFToPNGLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}