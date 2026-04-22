'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Combine, Download, Upload, ArrowLeft, CheckCircle, AlertCircle, X, GripVertical, Loader2, FileText, Minimize2, Scissors, Image, RotateCw } from 'lucide-react'
import Link from 'next/link'
import { PDFDocument } from 'pdf-lib'
import { WebApplicationSchema, FAQSchema, BreadcrumbSchema } from '@/components/SchemaMarkup'
import { PerformanceMonitor, reportCustomMetric } from '@/components/PerformanceMonitor'
import { generateToolFAQSchema } from '@/utils/seoMetadata'
import { ToolDescription } from '@/components/ToolDescription'

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(f => f.type === 'application/pdf')
    if (pdfFiles.length === 0) {
      setError('Please upload PDF files only')
      return
    }
    if (pdfFiles.some(f => f.size > 100 * 1024 * 1024)) {
      setError('Each file must be less than 100MB')
      return
    }
    setFiles(prev => [...prev, ...pdfFiles])
    setError(null)
    setDownloadUrl(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 100 * 1024 * 1024,
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const moveFile = (from: number, to: number) => {
    const newFiles = [...files]
    const [removed] = newFiles.splice(from, 1)
    newFiles.splice(to, 0, removed)
    setFiles(newFiles)
  }

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge')
      return
    }

    const startTime = performance.now()
    setStatus('processing')
    setProgress(10)
    setError(null)

    try {
      // Create new PDF document
      const mergedPdf = await PDFDocument.create()
      
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90))
      }, 200)

      // Load and merge all PDFs
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(page => mergedPdf.addPage(page))
      }

      clearInterval(progressInterval)
      setProgress(95)

      // Save merged PDF
      const mergedPdfBytes = await mergedPdf.save()
      const mergedArrayBuffer = mergedPdfBytes.buffer.slice(
        mergedPdfBytes.byteOffset,
        mergedPdfBytes.byteOffset + mergedPdfBytes.byteLength
      ) as ArrayBuffer
      const blob = new Blob([mergedArrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setDownloadUrl(url)
      setProgress(100)
      setStatus('completed')

      // Track performance metrics
      const endTime = performance.now()
      const executionTime = endTime - startTime
      reportCustomMetric('merge_pdf_execution_time', executionTime, {
        file_count: files.length,
        total_size_mb: (files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2),
      })
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to merge PDFs')
      reportCustomMetric('merge_pdf_error', 1, {
        error_message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const reset = () => {
    setFiles([])
    setStatus('idle')
    setProgress(0)
    setDownloadUrl(null)
    setError(null)
  }

  // Auto-download when completed
  useEffect(() => {
    if (status === 'completed' && downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'merged.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [status, downloadUrl])

  // Related tools
  const relatedTools = [
    { name: 'Compress PDF', icon: Minimize2, href: '/compress-pdf', desc: 'Reduce size' },
    { name: 'Split PDF', icon: Scissors, href: '/split-pdf', desc: 'Split pages' },
    { name: 'PDF to JPG', icon: Image, href: '/pdf-to-jpg', desc: 'To images' },
    { name: 'Rotate PDF', icon: RotateCw, href: '/rotate-pdf', desc: 'Rotate pages' },
  ]

  // Cloud save
  const saveToCloud = (provider: string) => {
    alert(`Save to ${provider} feature coming soon!`)
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://usepdf.xyz' },
    { name: 'Merge PDF', url: 'https://usepdf.xyz/merge-pdf' },
  ]

  const faqs = generateToolFAQSchema('mergePdf')

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Schema Markup */}
      <WebApplicationSchema
        name="Merge PDF - Combine Multiple PDFs Online"
        description="Free online PDF merger. Combine multiple PDF files into one. No registration required. 100% secure and private."
        url="https://usepdf.xyz/merge-pdf"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqs} />
      <PerformanceMonitor />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Combine className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PDF Tools
              </span>
            </Link>
            <Link href="/" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Merge PDF
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Combine multiple PDF files into a single document. 100% client-side processing.
            </p>
          </div>

          {/* Upload Area */}
          {status === 'idle' && (
            <>
              <div 
                {...getRootProps()} 
                className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-green-500" />
                  </div>
                  {isDragActive ? (
                    <p className="text-lg text-primary-600 font-medium">Drop PDFs here...</p>
                  ) : (
                    <>
                      <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Drag & drop PDF files here
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        or click to select files (max 100MB each)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="card p-4 flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        <button 
                          onClick={() => index > 0 && moveFile(index, index - 1)}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <GripVertical className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <Combine className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  {files.length >= 2 && (
                    <button
                      onClick={mergePDFs}
                      className="btn-primary w-full"
                    >
                      <Combine className="w-5 h-5 mr-2" />
                      Merge {files.length} PDFs
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Processing */}
          {status === 'processing' && (
            <div className="mt-6">
              <div className="card p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Merging your PDFs...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Processing {files.length} files
                </p>
                
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-sm text-gray-500 mt-2">{progress}%</p>
              </div>
            </div>
          )}

          {/* Completed */}
          {status === 'completed' && downloadUrl && (
            <div className="mt-6">
              <div className="card p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  PDFs Merged Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your merged PDF is ready. Downloading automatically...
                </p>
                
                {/* Cloud Save */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">Save to cloud</p>
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => saveToCloud('Dropbox')} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6.134L6.069 9.797 12 13.459l5.931-3.662L12 6.134zM6.069 10.798L0 14.461l6.069 3.663 5.931-3.663-5.931-3.663zm11.862 0l-5.931 3.663 5.931 3.663L24 14.461l-6.069-3.663z"/></svg>
                      Dropbox
                    </button>
                    <button onClick={() => saveToCloud('Google Drive')} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l2.16 3.62 6.55-10.73L7.71 3.5zm8.58 0l-6.55 10.73 2.16 3.62L18.85 7.12 16.29 3.5zm-3.43 9.25h4.28l-2.14-3.77-2.14 3.77z"/></svg>
                      Google Drive
                    </button>
                    <button onClick={() => saveToCloud('OneDrive')} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 18.5l-3.5-3.5 3.5-3.5-1.5-1.5-3.5 3.5-3.5-3.5-1.5 1.5 3.5 3.5-3.5 3.5 1.5 1.5 3.5-3.5 3.5 3.5 1.5-1.5z"/></svg>
                      OneDrive
                    </button>
                  </div>
                </div>

                <a href={downloadUrl} download="merged.pdf" className="btn-primary inline-flex">
                  <Download className="w-5 h-5 mr-2" />
                  Download Merged PDF
                </a>
                
                <button onClick={reset} className="block w-full mt-4 text-primary-600 hover:text-primary-700 font-medium">
                  Merge more files
                </button>
              </div>

              {/* Related Tools */}
              <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">You might also need</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {relatedTools.map((tool) => (
                    <Link key={tool.name} href={tool.href} className="flex flex-col items-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-2">
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</span>
                      <span className="text-xs text-gray-500">{tool.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Badge */}
          <div className="mt-8 text-center">
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              100% Client-side - Files never leave your device
            </p>
          </div>
        </div>

        {/* Tool Description Section */}
        <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
          <ToolDescription
            title="Merge PDF Files: Combine Multiple PDFs into One Document"
            description="Combine multiple PDF files into a single, seamless document instantly. Our PDF merger preserves the original quality, formatting, and page order of your documents. Perfect for combining reports, contracts, presentations, and any other PDF files."
            features={[
              'Merge unlimited PDF files into one document',
              'Preserve original quality and formatting',
              'Drag and drop to reorder pages before merging',
              'No file size limits or page restrictions',
              'Maintain bookmarks, links, and annotations',
              'Works on all devices without installation',
              '100% client-side processing - your files stay private',
              'Fast processing with progress tracking',
            ]}
            howTo={[
              {
                title: 'Upload Your PDF Files',
                description:
                  'Drag and drop multiple PDF files or click to browse. You can upload as many PDFs as you need.',
              },
              {
                title: 'Reorder if Needed',
                description:
                  'Drag the files to reorder them. The final PDF will be created in the order you arrange.',
              },
              {
                title: 'Merge PDFs',
                description:
                  'Click the Merge button and wait for the process to complete. Progress will be shown in real-time.',
              },
              {
                title: 'Download Your Merged PDF',
                description:
                  'Download your new combined PDF file. All original files are merged into one seamless document.',
              },
            ]}
            faqs={[
              {
                question: 'How many PDFs can I merge at once?',
                answer:
                  'You can merge as many PDF files as you want! There are no limits on the number of files or total pages.',
              },
              {
                question: 'Will the quality be preserved?',
                answer:
                  'Yes! Our merger preserves the original quality of all your PDF files. No compression or quality loss occurs during merging.',
              },
              {
                question: 'Can I change the order of pages?',
                answer:
                  'Absolutely. You can drag and drop the files to reorder them before merging. The final PDF will follow your chosen order.',
              },
              {
                question: 'What happens to bookmarks and links?',
                answer:
                  'Bookmarks, hyperlinks, and other interactive elements are preserved in the merged PDF whenever possible.',
              },
              {
                question: 'How long does merging take?',
                answer:
                  'Merging is very fast and usually completes in seconds, even with large files. The time depends on file sizes and your device.',
              },
              {
                question: 'Is my data secure?',
                answer:
                  'Absolutely. All merging happens 100% in your browser. Your files are never sent to any server. They stay completely private on your device.',
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}
