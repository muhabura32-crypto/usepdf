import type { Metadata } from 'next'
import { generateToolMetadata, toolMetadataConfigs } from '@/utils/seoMetadata'

export const metadata: Metadata = generateToolMetadata(toolMetadataConfigs.splitPdf)

export default function SplitPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}