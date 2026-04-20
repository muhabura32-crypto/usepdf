'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileImage, Download, Upload, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import JSZip from 'jszip'
import { ToolDescription } from '@/components/ToolDescription'

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

export default function PDFToPNGPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [pageCount, setPageCount] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high')
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const pdfFile = acceptedFiles[0]
      if (pdfFile.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        return
      }
      setFile(pdfFile)
      setError(null)
      setDownloadUrl(null)
      setPageCount(0)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
  })

  const convertToPNG = async () => {
    if (!file) return

    setStatus('processing')
    setProgress(0)
    setError(null)

    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs`

      setProgress(10)

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const totalPages = pdf.numPages
      setPageCount(totalPages)

      const urls: string[] = []
      const scale = quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext: context!,
          viewport: viewport
        }).promise

        const pngDataUrl = canvas.toDataURL('image/png', 1.0)
        urls.push(pngDataUrl)
        
        setProgress(10 + Math.round((i / totalPages) * 80))
      }

      pdf.destroy()

      // Create ZIP file
      const zip = new JSZip()
      urls.forEach((dataUrl, idx) => {
        const base64Data = dataUrl.split(',')[1]
        zip.file(`page-${idx + 1}.png`, base64Data, { base64: true })
      })

      setProgress(95)

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      
      setDownloadUrl(url)
      setProgress(100)
      setStatus('completed')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to PNG')
    }
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setDownloadUrl(null)
    setPageCount(0)
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
                PDF to PNG
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        {!file && (
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
                    {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    or click to browse files
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supports PDF files up to 50MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Selected */}
        {file && status === 'idle' && (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <FileImage className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white truncate max-w-md">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-2xl text-gray-400">×</span>
                </button>
              </div>
            </div>

            {/* Quality Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Image Quality
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
              onClick={convertToPNG}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Convert to PNG
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
                    Converting PDF to PNG
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {pageCount > 0 ? `Processing page ${Math.round((progress - 10) / 80 * pageCount)} of ${pageCount}` : 'Loading PDF...'}
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
                    {pageCount} PNG images extracted
                  </p>
                </div>
                <a
                  href={downloadUrl}
                  download="pdf-pages.zip"
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25"
                >
                  <Download className="w-5 h-5" />
                  Download PNG Images (ZIP)
                </a>
                <button
                  onClick={reset}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  Convert another PDF
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
            title="Convert PDF to PNG: High-Quality Image Extraction"
            description="Convert your PDF files to high-quality PNG images instantly. Our PDF to PNG converter extracts each page as a separate PNG file, preserving quality and maintaining transparency support. Perfect for sharing, archiving, or further editing your PDF content as images."
            features={[
              'Extract each PDF page as a separate PNG file',
              'Support for transparent PNG backgrounds',
              'Multiple quality options (High, Medium, Low)',
              'Batch conversion - process entire PDFs at once',
              'No file size limits',
              'Works on all devices without installation',
              '100% client-side processing - your files stay private',
              'Download as organized ZIP file',
            ]}
            howTo={[
              {
                title: 'Upload Your PDF',
                description:
                  'Drag and drop your PDF file or click to browse. You can also paste a PDF if using a modern browser.',
              },
              {
                title: 'Select Quality',
                description:
                  'Choose between High, Medium, or Low quality. High quality preserves more detail but creates larger files.',
              },
              {
                title: 'Convert to PNG',
                description:
                  'Click the Convert button and wait for the conversion to complete. Progress will be shown.',
              },
              {
                title: 'Download',
                description:
                  'Once complete, download all PNG images as a ZIP file. Extract the files to access individual images.',
              },
            ]}
            faqs={[
              {
                question: 'What quality should I choose?',
                answer:
                  'Choose High for best quality and detail (best for printing/archival), Medium for balanced quality and file size (most common), or Low for smaller files but less detail. Experiment to find what works best for your needs.',
              },
              {
                question: 'Why is my PNG larger than my PDF?',
                answer:
                  'PNG images can sometimes be larger than PDFs because they store image data differently. High-quality settings will create larger files. Try Medium or Low quality if file size is a concern.',
              },
              {
                question: 'Can I convert scanned PDFs?',
                answer:
                  'Yes! Our converter works with any PDF including scanned documents. The quality of the output depends on the quality of the original PDF.',
              },
              {
                question: 'How long does conversion take?',
                answer:
                  'Conversion is very fast since it happens on your device. Most PDFs convert in seconds. Larger files or High quality settings may take a bit longer.',
              },
              {
                question: 'Is my data secure?',
                answer:
                  'Absolutely. All conversion happens 100% in your browser. Your files are never sent to any server. They stay completely private on your device.',
              },
              {
                question: 'What file formats can I use as input?',
                answer:
                  'We accept PDF files only. Make sure your file is in standard PDF format. Most common PDF types are supported.',
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}
