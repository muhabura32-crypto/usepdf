import type { Metadata } from 'next'
import { generateToolMetadata, toolMetadataConfigs } from '@/utils/seoMetadata'

export const metadata: Metadata = generateToolMetadata(toolMetadataConfigs.rotatePdf)

export default function RotatePDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}