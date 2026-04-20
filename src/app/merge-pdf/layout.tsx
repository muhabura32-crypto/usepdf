import type { Metadata } from 'next'
import { generateToolMetadata, toolMetadataConfigs } from '@/utils/seoMetadata'

export const metadata: Metadata = generateToolMetadata(toolMetadataConfigs.mergePdf)

export default function MergePDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
