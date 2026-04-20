'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Image as ImageIcon, Download, Upload, ArrowLeft, CheckCircle, AlertCircle, Loader2, File, FileText, Minimize2, Combine, Scissors, RotateCw } from 'lucide-react'
import Link from 'next/link'
import { ToolDescription } from '@/components/ToolDescription'

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

export default function PDFToJPGPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [downloadUrls, setDownloadUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const pdfFile = acceptedFiles[0]
      if (pdfFile.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        return
      }
      if (pdfFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
        return
      }
      setFile(pdfFile)
      setPageCount(0) // Will be set after processing starts
      setError(null)
      setStatus('idle')
      setDownloadUrls([])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  })

  const convertToJPG = async () => {
    if (!file) return

    setStatus('processing')
    setProgress(10)
    setError(null)

    try {
      // Dynamic import to avoid SSR issues with pdf.js
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker - using hardcoded version for reliability
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs`
      
      setProgress(20)

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const totalPages = pdf.numPages
      setPageCount(totalPages)
      
      const urls: string[] = []
      const scale = quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        
        // Create canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width
        
        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise
          
          // Convert to JPG
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality === 'high' ? 0.95 : quality === 'medium' ? 0.85 : 0.7)
          })
          
          const url = URL.createObjectURL(blob)
          urls.push(url)
        }
        
        setProgress(20 + Math.round((i / totalPages) * 75))
      }

      setDownloadUrls(urls)
      setProgress(100)
      setStatus('completed')
    } catch (err) {
      console.error('Conversion error:', err)
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to JPG')
    }
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setDownloadUrls([])
    setError(null)
    setPageCount(0)
  }

  const downloadAll = () => {
    downloadUrls.forEach((url, index) => {
      const link = document.createElement('a')
      link.href = url
      link.download = `page-${index + 1}.jpg`
      link.click()
    })
  }

  // Auto-download when completed
  useEffect(() => {
    if (status === 'completed' && downloadUrls.length > 0) {
      downloadAll()
    }
  }, [status, downloadUrls])

  // Related tools
  const relatedTools = [
    { name: 'Compress PDF', icon: Minimize2, href: '/compress-pdf', desc: 'Reduce size' },
    { name: 'Merge PDF', icon: Combine, href: '/merge-pdf', desc: 'Combine files' },
    { name: 'Split PDF', icon: Scissors, href: '/split-pdf', desc: 'Split pages' },
    { name: 'Rotate PDF', icon: RotateCw, href: '/rotate-pdf', desc: 'Rotate pages' },
  ]

  // Cloud save
  const saveToCloud = (provider: string) => {
    alert(`Save to ${provider} feature coming soon!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Image className="w-6 h-6 text-white" />
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
              PDF to JPG
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Convert PDF pages to high-quality images. 100% client-side processing.
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
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-pink-500" />
                  </div>
                  {isDragActive ? (
                    <p className="text-lg text-primary-600 font-medium">Drop your PDF here...</p>
                  ) : (
                    <>
                      <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Drag & drop your PDF here
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        or click to select a file (max 50MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* File Info & Options */}
              {file && (
                <div className="mt-6">
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4">
                          <Image className="w-6 h-6 text-red-500" />
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

                    {/* Quality Options */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Image Quality
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="quality"
                            checked={quality === 'low'}
                            onChange={() => setQuality('low')}
                            className="mr-2"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Low (smaller files)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="quality"
                            checked={quality === 'medium'}
                            onChange={() => setQuality('medium')}
                            className="mr-2"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Medium</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="quality"
                            checked={quality === 'high'}
                            onChange={() => setQuality('high')}
                            className="mr-2"
                          />
                          <span className="text-gray-700 dark:text-gray-300">High</span>
                        </label>
                      </div>
                    </div>
                    
                    <button
                      onClick={convertToJPG}
                      className="btn-primary w-full"
                    >
                      <Image className="w-5 h-5 mr-2" />
                      Convert to JPG
                    </button>
                  </div>
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
                  Converting your PDF...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {pageCount > 0 ? `Converting page ${Math.min(pageCount, Math.round((progress - 20) / 75 * pageCount))} of ${pageCount}` : 'Processing PDF pages'}
                </p>
                
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-sm text-gray-500 mt-2">{progress}%</p>
              </div>
            </div>
          )}

          {/* Completed */}
          {status === 'completed' && downloadUrls.length > 0 && (
            <div className="mt-6">
              <div className="card p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Conversion Complete!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {downloadUrls.length} images created
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto mb-4">
                  {downloadUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      download={`page-${index + 1}.jpg`}
                      className="relative group aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt={`Page ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={downloadAll}
                    className="btn-primary flex-1"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download All
                  </button>
                  <button
                    onClick={reset}
                    className="btn-secondary flex-1"
                  >
                    Convert another file
                  </button>
                </div>
              </div>

              {/* Cloud Save */}
              <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">Save to cloud</p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button onClick={() => saveToCloud('Dropbox')} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 bg-white">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6.134L6.069 9.797 12 13.459l5.931-3.662L12 6.134zM6.069 10.798L0 14.461l6.069 3.663 5.931-3.663-5.931-3.663zm11.862 0l-5.931 3.663 5.931 3.663L24 14.461l-6.069-3.663z"/></svg>
                    Dropbox
                  </button>
                  <button onClick={() => saveToCloud('Google Drive')} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 bg-white">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l2.16 3.62 6.55-10.73L7.71 3.5zm8.58 0l-6.55 10.73 2.16 3.62L18.85 7.12 16.29 3.5zm-3.43 9.25h4.28l-2.14-3.77-2.14 3.77z"/></svg>
                    Google Drive
                  </button>
                  <button onClick={() => saveToCloud('OneDrive')} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 bg-white">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 18.5l-3.5-3.5 3.5-3.5-1.5-1.5-3.5 3.5-3.5-3.5-1.5 1.5 3.5 3.5-3.5 3.5 1.5 1.5 3.5-3.5 3.5 3.5 1.5-1.5z"/></svg>
                    OneDrive
                  </button>
                </div>
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
            title="Convert PDF to JPG: Extract Images from PDF Documents"
            description="Convert your PDF pages to high-quality JPG images. Each page becomes a separate image file, perfect for sharing, editing, or archiving. Choose from different quality settings to balance file size and image quality."
            features={[
              'Convert PDF pages to JPG images',
              'Each page becomes a separate image file',
              'High, medium, and low quality options',
              'Preserve original page layout and content',
              'Fast batch conversion',
              'Download all images in a ZIP file',
              'No file size limits',
              'Works on all devices without installation',
              '100% client-side processing - your files stay private',
            ]}
            howTo={[
              {
                title: 'Upload Your PDF',
                description:
                  'Drag and drop your PDF file or click to browse. Files up to 50MB are supported.',
              },
              {
                title: 'Choose Quality Setting',
                description:
                  'Select image quality: High (best quality, larger files), Medium (balanced), or Low (smaller files).',
              },
              {
                title: 'Convert to Images',
                description:
                  'Click "Convert to JPG" and watch the progress. Each page is converted to a separate image.',
              },
              {
                title: 'Download Images',
                description:
                  'Download all converted images in a ZIP file. Each image is named with the page number.',
              },
            ]}
            faqs={[
              {
                question: 'How many images will I get?',
                answer:
                  'You\'ll get one JPG image for each page in your PDF. A 10-page PDF will create 10 separate JPG files.',
              },
              {
                question: 'What quality should I choose?',
                answer:
                  'High quality for printing or professional use, Medium for web sharing, Low for email attachments or when file size matters most.',
              },
              {
                question: 'Can I convert specific pages only?',
                answer:
                  'Currently, all pages are converted. If you need specific pages, consider splitting your PDF first, then converting the desired section.',
              },
              {
                question: 'What happens to text in the PDF?',
                answer:
                  'Text is rendered as part of the image. The resulting JPG will look exactly like the PDF page, but the text won\'t be selectable.',
              },
              {
                question: 'Are there any quality limitations?',
                answer:
                  'JPG images are compressed, so very detailed graphics or text may appear slightly pixelated at lower quality settings. High quality preserves the most detail.',
              },
              {
                question: 'Can I convert scanned PDFs?',
                answer:
                  'Yes! This tool works great for scanned documents. The images will be extracted exactly as they appear in the PDF.',
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}
