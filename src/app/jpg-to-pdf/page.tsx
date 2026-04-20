'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileImage, Download, Upload, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import JSZip from 'jszip'
import { ToolDescription } from '@/components/ToolDescription'

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

export default function JPGToPDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high')
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file =>
      file.type === 'image/jpeg' || file.type === 'image/jpg'
    )

    if (imageFiles.length === 0) {
      setError('Please upload JPG/JPEG files only')
      return
    }

    setFiles(imageFiles)
    setError(null)
    setDownloadUrl(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg']
    },
    multiple: true,
  })

  const convertToPDF = async () => {
    if (files.length === 0) return

    setStatus('processing')
    setProgress(0)
    setError(null)

    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs`

      setProgress(10)

      // Create a new PDF document
      const { PDFDocument } = await import('pdf-lib')
      const pdfDoc = await PDFDocument.create()

      const scale = quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const imageBytes = await file.arrayBuffer()

        // Create image from file
        const img = new window.Image()
        const imgPromise = new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = reject
          img.src = URL.createObjectURL(file)
        })
        await imgPromise

        // Add page to PDF
        const page = pdfDoc.addPage([img.width * scale, img.height * scale])
        const image = await pdfDoc.embedJpg(imageBytes)
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: img.width * scale,
          height: img.height * scale,
        })

        setProgress(10 + Math.round(((i + 1) / files.length) * 80))
      }

      setProgress(95)

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      setDownloadUrl(url)
      setProgress(100)
      setStatus('completed')
    } catch (err) {
      console.error('Conversion error:', err)
      setError('Failed to convert images to PDF. Please try again.')
      setStatus('error')
    }
  }

  const reset = () => {
    setFiles([])
    setStatus('idle')
    setDownloadUrl(null)
    setProgress(0)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                JPG to PDF
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    {isDragActive ? 'Drop your JPG files here' : 'Drag & drop your JPG files here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    or click to browse files
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supports JPG/JPEG files up to 50MB each
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
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <FileImage className="w-5 h-5 text-red-600 dark:text-red-400" />
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

            {/* Quality Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                PDF Quality
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(['high', 'medium', 'low'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      quality === q
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {q.charAt(0).toUpperCase() + q.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={convertToPDF}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Convert to PDF
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
                    Converting JPG to PDF
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Processing {files.length} image{files.length > 1 ? 's' : ''}...
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

        {/* Completed */}
        {status === 'completed' && downloadUrl && (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Conversion Complete!
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {files.length} JPG image{files.length > 1 ? 's' : ''} converted to PDF
                  </p>
                </div>
                <a
                  href={downloadUrl}
                  download="converted-images.pdf"
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </a>
                <button
                  onClick={reset}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  Convert another batch
                </button>
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
            title="Convert JPG to PDF: High-Quality Image to Document Conversion"
            description="Transform your JPG images into professional PDF documents instantly. Our JPG to PDF converter preserves image quality while creating organized, shareable PDF files. Perfect for converting photos, screenshots, or scanned documents into PDF format."
            features={[
              'Convert multiple JPG images to a single PDF',
              'Preserve image quality and resolution',
              'Support for high, medium, and low quality options',
              'Batch processing - convert multiple images at once',
              'No file size limits for individual images',
              'Works on all devices without installation',
              '100% client-side processing - your images stay private',
              'Organized page order from uploaded sequence',
            ]}
            howTo={[
              {
                title: 'Upload Your JPG Images',
                description:
                  'Drag and drop multiple JPG files or click to browse. You can select multiple images to combine into one PDF.',
              },
              {
                title: 'Select PDF Quality',
                description:
                  'Choose between High, Medium, or Low quality. Higher quality preserves more detail but creates larger files.',
              },
              {
                title: 'Convert to PDF',
                description:
                  'Click the Convert button and wait for the conversion to complete. Progress will be shown for each image.',
              },
              {
                title: 'Download Your PDF',
                description:
                  'Once complete, download your new PDF file. All images will be combined in the order you uploaded them.',
              },
            ]}
            faqs={[
              {
                question: 'What quality should I choose?',
                answer:
                  'Choose High for best quality and detail (recommended for photos and important documents), Medium for balanced quality and file size (most common), or Low for smaller files when quality is less critical.',
              },
              {
                question: 'Can I control the page order?',
                answer:
                  'Yes! The images will be added to the PDF in the exact order you upload them. If you need a different order, simply reorder your files before uploading.',
              },
              {
                question: 'What happens to image orientation?',
                answer:
                  'Images are converted as-is. If your JPG has rotation metadata, it will be preserved. You can rotate images before uploading if needed.',
              },
              {
                question: 'How long does conversion take?',
                answer:
                  'Conversion is very fast since it happens on your device. Most conversions complete in seconds, even with multiple images.',
              },
              {
                question: 'Is my data secure?',
                answer:
                  'Absolutely. All conversion happens 100% in your browser. Your images are never sent to any server. They stay completely private on your device.',
              },
              {
                question: 'What file formats can I use as input?',
                answer:
                  'We accept JPG and JPEG files only. For other image formats like PNG, use our PNG to PDF converter.',
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}
