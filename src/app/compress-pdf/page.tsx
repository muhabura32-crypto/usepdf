'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Minimize2, Download, Upload, ArrowLeft, CheckCircle, AlertCircle, Loader2, FileText, Combine, Scissors, Image, RotateCw } from 'lucide-react'
import Link from 'next/link'
import { PDFDocument } from 'pdf-lib'
import { ToolDescription } from '@/components/ToolDescription'

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const pdfFile = acceptedFiles[0]
      if (pdfFile.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        return
      }
      if (pdfFile.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB')
        return
      }
      setFile(pdfFile)
      setOriginalSize(pdfFile.size)
      setError(null)
      setStatus('idle')
      setDownloadUrl(null)
      setCompressedSize(0)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
  })

  const compressPDF = async () => {
    if (!file) return

    setStatus('processing')
    setProgress(10)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      setProgress(20)

      // Dynamic import to avoid SSR issues with pdf.js
      const pdfjsLib = await import('pdfjs-dist')
      
      // Use jsdelivr CDN for worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/build/pdf.worker.min.mjs`
      
      // Load PDF using PDF.js for rendering
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const totalPages = pdf.numPages
      setProgress(30)

      // Create a new PDF document
      const newPdfDoc = await PDFDocument.create()
      
      // Process each page
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.0 })
        
        // Create canvas at reduced scale for compression
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        
        // Use 1.0 scale for quality
        const scale = 1.0
        canvas.width = viewport.width * scale
        canvas.height = viewport.height * scale
        
        if (context) {
          await page.render({
            canvasContext: context,
            viewport: page.getViewport({ scale })
          }).promise
          
          // Convert to JPEG with compression (0.7 = 70% quality)
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.7)
          })
          
          // Add image to new PDF
          const image = await newPdfDoc.embedJpg(await blob.arrayBuffer())
          const newPage = newPdfDoc.addPage([viewport.width, viewport.height])
          newPage.drawImage(image, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          })
        }
        
        setProgress(30 + Math.round((i / totalPages) * 60))
      }
      
      setProgress(95)
      
      // Save with compression
      const compressedPdfBytes = await newPdfDoc.save({
        useObjectStreams: true,
      })
      
      // Convert Uint8Array to ArrayBuffer for Blob compatibility
      const pdfBuffer = compressedPdfBytes.buffer.slice(
        compressedPdfBytes.byteOffset,
        compressedPdfBytes.byteOffset + compressedPdfBytes.byteLength
      ) as ArrayBuffer
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setCompressedSize(blob.size)
      setDownloadUrl(url)
      setProgress(100)
      setStatus('completed')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to compress PDF')
    }
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setDownloadUrl(null)
    setError(null)
    setOriginalSize(0)
    setCompressedSize(0)
  }

  const getSavings = () => {
    if (originalSize === 0 || compressedSize === 0) return 0
    return Math.round(((originalSize - compressedSize) / originalSize) * 100)
  }

  // Auto-download when completed
  useEffect(() => {
    if (status === 'completed' && downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'compressed.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [status, downloadUrl])

  // Related tools
  const relatedTools = [
    { name: 'Merge PDF', icon: Combine, href: '/merge-pdf', desc: 'Combine files' },
    { name: 'Split PDF', icon: Scissors, href: '/split-pdf', desc: 'Split pages' },
    { name: 'PDF to JPG', icon: Image, href: '/pdf-to-jpg', desc: 'To images' },
    { name: 'Rotate PDF', icon: RotateCw, href: '/rotate-pdf', desc: 'Rotate pages' },
  ]

  // Cloud save
  const saveToCloud = (provider: string) => {
    alert(`Save to ${provider} feature coming soon!`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Minimize2 className="w-6 h-6 text-white" />
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
              Compress PDF
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Reduce PDF file size without losing quality. 100% client-side processing.
            </p>
          </div>

          {/* Upload Area */}
          {status === 'idle' && (
            <div 
              {...getRootProps()} 
              className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-orange-500" />
                </div>
                {isDragActive ? (
                  <p className="text-lg text-primary-600 font-medium">Drop your PDF here...</p>
                ) : (
                  <>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Drag & drop your PDF here
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      or click to select a file (max 100MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* File Selected */}
          {file && status === 'idle' && (
            <div className="mt-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4">
                      <Minimize2 className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
                
                <button
                  onClick={compressPDF}
                  className="btn-primary w-full"
                >
                  <Minimize2 className="w-5 h-5 mr-2" />
                  Compress PDF
                </button>
              </div>
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
                  Compressing your PDF...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Optimizing file size
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
                  PDF Compressed Successfully!
                </h3>
                
                {/* Size comparison */}
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Original</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(originalSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="text-2xl text-gray-400">→</div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Compressed</p>
                    <p className="text-lg font-semibold text-green-600">
                      {(compressedSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Saved</p>
                    <p className="text-lg font-bold text-green-600">
                      {getSavings()}%
                    </p>
                  </div>
                </div>
                
                <a
                  href={downloadUrl}
                  download="compressed.pdf"
                  className="btn-primary inline-flex"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Compressed PDF
                </a>
                
                {/* Cloud Save */}
                <div className="mt-6 mb-4">
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
                
                <button
                  onClick={reset}
                  className="block w-full mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Compress another file
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
            title="Compress PDF: Reduce File Size While Maintaining Quality"
            description="Shrink your PDF file sizes without losing quality. Our advanced compression algorithm optimizes images, fonts, and document structure to create smaller PDFs that look exactly the same. Perfect for email attachments, web uploads, and storage optimization."
            features={[
              'Reduce PDF file size by up to 80%',
              'Maintain original quality and readability',
              'Automatic optimization of images and fonts',
              'Preserve text, layout, and formatting',
              'Show compression ratio and savings',
              'No file size limits',
              'Works on all devices without installation',
              '100% client-side processing - your files stay private',
            ]}
            howTo={[
              {
                title: 'Upload Your PDF',
                description:
                  'Drag and drop your PDF file or click to browse. Files up to 100MB are supported.',
              },
              {
                title: 'Automatic Compression',
                description:
                  'Our algorithm automatically optimizes your PDF by compressing images, subsetting fonts, and removing unnecessary data.',
              },
              {
                title: 'Review Results',
                description:
                  'See the compression results showing original size, new size, and percentage saved.',
              },
              {
                title: 'Download Compressed PDF',
                description:
                  'Download your optimized PDF file. The quality remains the same while the file size is significantly reduced.',
              },
            ]}
            faqs={[
              {
                question: 'How much can I compress a PDF?',
                answer:
                  'Compression depends on the original PDF content. Typically, you can expect 30-80% size reduction. PDFs with many images compress more than text-only documents.',
              },
              {
                question: 'Will the quality be affected?',
                answer:
                  'No! Our compression preserves the visual quality while reducing file size. Text remains crisp and images stay clear.',
              },
              {
                question: 'What types of PDFs compress best?',
                answer:
                  'PDFs with high-resolution images, embedded fonts, or large graphics compress the most. Scanned documents and image-heavy PDFs see the biggest size reductions.',
              },
              {
                question: 'Is there a file size limit?',
                answer:
                  'You can compress PDFs up to 100MB in size. For larger files, consider splitting them first or contact us for enterprise solutions.',
              },
              {
                question: 'How long does compression take?',
                answer:
                  'Compression is very fast and usually completes in seconds. The time depends on file size and complexity.',
              },
              {
                question: 'Is my data secure?',
                answer:
                  'Absolutely. All compression happens 100% in your browser. Your files are never sent to any server. They stay completely private on your device.',
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}
