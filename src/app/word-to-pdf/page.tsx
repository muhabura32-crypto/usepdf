'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Download, Upload, ArrowLeft, AlertCircle, Loader2, Info } from 'lucide-react'
import Link from 'next/link'
import { ToolDescription } from '@/components/ToolDescription'

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

export default function WordToPDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const wordFiles = acceptedFiles.filter(file =>
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword' ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx')
    )

    if (wordFiles.length === 0) {
      setError('Please upload Word documents (.doc or .docx files)')
      return
    }

    setFiles(wordFiles)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: true,
  })

  const convertToPDF = async () => {
    if (files.length === 0) return

    setStatus('processing')
    setProgress(0)
    setError(null)

    try {
      // Note: Word to PDF conversion requires server-side processing
      // This is a placeholder for the UI - actual conversion would need backend
      setProgress(10)

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProgress(50)

      await new Promise(resolve => setTimeout(resolve, 1000))
      setProgress(90)

      // For now, show that this feature requires server-side processing
      setError('Word to PDF conversion requires server-side processing. This feature is coming soon!')
      setStatus('error')

    } catch (err) {
      console.error('Conversion error:', err)
      setError('Failed to convert Word document to PDF. Please try again.')
      setStatus('error')
    }
  }

  const reset = () => {
    setFiles([])
    setStatus('idle')
    setProgress(0)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Word to PDF
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Coming Soon: Word to PDF Conversion
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Word document conversion requires server-side processing for accurate formatting preservation.
                This feature is currently in development and will be available soon.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {files.length === 0 && (
          <div className="animate-fadeIn">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02]'
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDragActive ? 'Drop your Word files here' : 'Drag & drop your Word files here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    or click to browse files (.doc, .docx)
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supports Word documents up to 50MB each
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Files Selected */}
        {files.length > 0 && status === 'idle' && (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {files.length} file{files.length > 1 ? 's' : ''} selected
                </h3>
                <button
                  onClick={reset}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-2xl text-gray-400">×</span>
                </button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={convertToPDF}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Convert to PDF (Coming Soon)
            </button>
          </div>
        )}

        {/* Processing */}
        {status === 'processing' && (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Preparing Word to PDF Conversion
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This feature is coming soon...
                  </p>
                </div>
                {/* Progress Bar */}
                <div className="w-full max-w-md">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Tool Description Section */}
        <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
          <ToolDescription
            title="Convert Word to PDF: Professional Document Conversion (Coming Soon)"
            description="Transform your Word documents (.doc, .docx) into professional PDF files while preserving formatting, fonts, and layout. Our Word to PDF converter ensures your documents look exactly the same in PDF format. This feature is currently in development and will be available soon."
            features={[
              'Preserve Word document formatting and layout',
              'Maintain fonts, colors, and styling',
              'Convert complex documents with tables and images',
              'Support for .doc and .docx file formats',
              'Batch processing - convert multiple documents',
              'High-fidelity conversion with professional results',
              'Secure server-side processing (coming soon)',
              'Fast conversion with progress tracking',
            ]}
            howTo={[
              {
                title: 'Upload Your Word Documents',
                description:
                  'Drag and drop your .doc or .docx files. Multiple files can be converted at once.',
              },
              {
                title: 'Automatic Processing',
                description:
                  'Our system will preserve all formatting, fonts, and layout from your Word document.',
              },
              {
                title: 'Download PDF Files',
                description:
                  'Download your converted PDF files that maintain the exact appearance of your Word documents.',
              },
              {
                title: 'Review and Share',
                description:
                  'Review the converted PDFs and share them confidently knowing the formatting is preserved.',
              },
            ]}
            faqs={[
              {
                question: 'When will Word to PDF conversion be available?',
                answer:
                  'Word to PDF conversion requires server-side processing for accurate formatting preservation. This feature is currently in development and will be available soon. We appreciate your patience!',
              },
              {
                question: 'Will my document formatting be preserved?',
                answer:
                  'Yes! Our converter is designed to preserve all formatting including fonts, colors, tables, images, headers, footers, and page layout. The PDF will look identical to your Word document.',
              },
              {
                question: 'What Word formats are supported?',
                answer:
                  'We support both .doc (older Word format) and .docx (modern Word format) files. Most Word documents created in recent versions should work perfectly.',
              },
              {
                question: 'Can I convert password-protected documents?',
                answer:
                  'Currently, password-protected Word documents cannot be converted. Please remove the password protection before uploading.',
              },
              {
                question: 'How large can my Word documents be?',
                answer:
                  'We support Word documents up to 50MB in size. For very large documents, the conversion may take longer to complete.',
              },
              {
                question: 'Is my data secure?',
                answer:
                  'Security is our top priority. When this feature becomes available, all processing will be done securely with enterprise-grade encryption and data protection.',
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}
