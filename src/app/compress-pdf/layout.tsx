import type { Metadata } from 'next'
import { generateToolMetadata, toolMetadataConfigs } from '@/utils/seoMetadata'

export const metadata: Metadata = generateToolMetadata(toolMetadataConfigs.compressPdf)

export default function CompressPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}