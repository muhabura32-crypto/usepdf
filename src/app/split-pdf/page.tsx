'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Scissors, Download, Upload, ArrowLeft, CheckCircle, AlertCircle, Loader2, File, Minimize2, Combine, Image, RotateCw } from 'lucide-react'
import Link from 'next/link'
import { PDFDocument } from 'pdf-lib'
import { ToolDescription } from '@/components/ToolDescription'

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [downloadUrls, setDownloadUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all')
  const [pageRange, setPageRange] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
      
      try {
        const arrayBuffer = await pdfFile.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        setPageCount(pdfDoc.getPageCount())
      } catch (e) {
        setError('Invalid PDF file')
        return
      }
      
      setFile(pdfFile)
      setError(null)
      setStatus('idle')
      setDownloadUrls([])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
  })

  const splitPDF = async () => {
    if (!file) return

    setStatus('processing')
    setProgress(10)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const totalPages = pdfDoc.getPageCount()
      
      setProgress(30)

      const urls: string[] = []

      if (splitMode === 'all') {
        // Split into individual pages
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create()
          const [page] = await newPdf.copyPages(pdfDoc, [i])
          newPdf.addPage(page)
          
          const pdfBytes = await newPdf.save()
          const pdfArrayBuffer = pdfBytes.buffer.slice(
            pdfBytes.byteOffset,
            pdfBytes.byteOffset + pdfBytes.byteLength
          ) as ArrayBuffer
          const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          urls.push(url)
          
          setProgress(30 + Math.round((i / totalPages) * 60))
        }
      } else {
        // Split by range
        const ranges = pageRange.split(',').map(r => r.trim())
        
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i]
          const newPdf = await PDFDocument.create()
          
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(n => parseInt(n.trim()) - 1)
            const indices = []
            for (let j = start; j <= end && j < totalPages; j++) {
              indices.push(j)
            }
            const pages = await newPdf.copyPages(pdfDoc, indices)
            pages.forEach(page => newPdf.addPage(page))
          } else {
            const pageIndex = parseInt(range) - 1
            if (pageIndex >= 0 && pageIndex < totalPages) {
              const [page] = await newPdf.copyPages(pdfDoc, [pageIndex])
              newPdf.addPage(page)
            }
          }
          
          const pdfBytes = await newPdf.save()
          const pdfArrayBuffer = pdfBytes.buffer.slice(
            pdfBytes.byteOffset,
            pdfBytes.byteOffset + pdfBytes.byteLength
          ) as ArrayBuffer
          const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          urls.push(url)
          
          setProgress(30 + Math.round((i / ranges.length) * 60))
        }
      }

      setDownloadUrls(urls)
      setProgress(100)
      setStatus('completed')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to split PDF')
    }
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setDownloadUrls([])
    setError(null)
    setPageCount(0)
    setPageRange('')
  }

  // Auto-download when completed (for single page)
  useEffect(() => {
    if (status === 'completed' && downloadUrls.length === 1) {
      const link = document.createElement('a')
      link.href = downloadUrls[0]
      link.download = 'split-page-1.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [status, downloadUrls])

  // Related tools
  const relatedTools = [
    { name: 'Compress PDF', icon: Minimize2, href: '/compress-pdf', desc: 'Reduce size' },
    { name: 'Merge PDF', icon: Combine, href: '/merge-pdf', desc: 'Combine files' },
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Scissors className="w-6 h-6 text-white" />
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
              Split PDF
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Extract pages or split PDF into multiple files. 100% client-side processing.
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
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-purple-500" />
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

              {/* File Info & Options */}
              {file && pageCount > 0 && (
                <div className="mt-6">
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4">
                          <Scissors className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB
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

                    {/* Split Options */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Split Mode
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="splitMode"
                            checked={splitMode === 'all'}
                            onChange={() => setSplitMode('all')}
                            className="mr-2"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Extract all pages</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="splitMode"
                            checked={splitMode === 'range'}
                            onChange={() => setSplitMode('range')}
                            className="mr-2"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Custom range</span>
                        </label>
                      </div>
                    </div>

                    {splitMode === 'range' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Page Range (e.g., "1-3, 5, 7-10")
                        </label>
                        <input
                          type="text"
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder="1-3, 5, 7-10"
                          className="input-field"
                        />
                      </div>
                    )}
                    
                    <button
                      onClick={splitPDF}
                      className="btn-primary w-full"
                    >
                      <Scissors className="w-5 h-5 mr-2" />
                      Split PDF
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
                  Splitting your PDF...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Extracting pages
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
                    PDF Split Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {downloadUrls.length} files created
                  </p>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                  {downloadUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      download={`page-${index + 1}.pdf`}
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <File className="w-5 h-5 text-red-500 mr-3" />
                      <span className="flex-1 text-gray-900 dark:text-white">
                        Page {index + 1}
                      </span>
                      <Download className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                </div>
                
                <button
                  onClick={reset}
                  className="btn-secondary w-full"
                >
                  Split another file
                </button>
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
            title="Split PDF: Extract Pages or Divide Documents Easily"
            description="Split your PDF into multiple files or extract specific pages. Choose to split all pages into separate files or extract a custom page range. Perfect for separating chapters, extracting specific sections, or creating smaller, more manageable PDF files."
            features={[
              'Split PDF into individual pages',
              'Extract custom page ranges (e.g., 1-5, 8, 10-15)',
              'Create multiple PDF files from one document',
              'Preserve original quality and formatting',
              'Fast processing with progress tracking',
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
                title: 'Choose Split Method',
                description:
                  'Select "Split All Pages" to create separate files for each page, or "Extract Range" to specify page numbers.',
              },
              {
                title: 'Enter Page Range (Optional)',
                description:
                  'For range extraction, enter pages like "1-5, 8, 10-15" to extract specific pages or ranges.',
              },
              {
                title: 'Split and Download',
                description:
                  'Click "Split PDF" and download your split files. Each file will be named with the original filename plus page numbers.',
              },
            ]}
            faqs={[
              {
                question: 'How do I extract specific pages?',
                answer:
                  'Use the "Extract Range" option and enter page numbers. Use commas to separate individual pages (e.g., "1,3,5") and hyphens for ranges (e.g., "2-6"). You can combine both: "1-3, 5, 7-9".',
              },
              {
                question: 'Can I split a PDF into individual pages?',
                answer:
                  'Yes! Choose "Split All Pages" and each page will become a separate PDF file. This is perfect for creating individual documents from a multi-page PDF.',
              },
              {
                question: 'What happens to the original formatting?',
                answer:
                  'All original formatting, text, images, and layout are preserved exactly as they appear in the original PDF. Splitting only affects the page structure.',
              },
              {
                question: 'Is there a limit to how many pages I can split?',
                answer:
                  'No limits! You can split PDFs with hundreds or thousands of pages. The only limitation is your device\'s memory for very large files.',
              },
              {
                question: 'How are the split files named?',
                answer:
                  'Files are named with the original filename plus "_page_X" where X is the page number. For example, "document.pdf" becomes "document_page_1.pdf", "document_page_2.pdf", etc.',
              },
              {
                question: 'Can I split password-protected PDFs?',
                answer:
                  'No, you\'ll need to remove the password protection first. Our tool cannot process encrypted PDFs.',
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}
