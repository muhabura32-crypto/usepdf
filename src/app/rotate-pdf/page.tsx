'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Download, Upload, ArrowLeft, CheckCircle, AlertCircle, Loader2, RotateCw } from 'lucide-react'
import Link from 'next/link'
import { ToolDescription } from '@/components/ToolDescription'

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error'

export default function RotatePDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [rotation, setRotation] = useState(90)
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
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  const rotatePDF = async () => {
    if (!file) return

    setStatus('processing')
    setError(null)

    try {
      const { PDFDocument, degrees } = await import('pdf-lib')
      
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      const pages = pdfDoc.getPages()
      for (const page of pages) {
        const currentRotation = page.getRotation().angle
        page.setRotation(degrees(currentRotation + rotation))
      }

      const pdfBytes = await pdfDoc.save()
      const pdfBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
      ) as ArrayBuffer
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      setDownloadUrl(url)
      setStatus('completed')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to rotate PDF')
    }
  }

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setDownloadUrl(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
                Rotate PDF
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!file && (
          <div className="animate-fadeIn">
            <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'}`}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-orange-600" />
                </div>
                <p className="text-lg font-medium">Drag & drop PDF here</p>
              </div>
            </div>
          </div>
        )}

        {file && status === 'idle' && (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={reset} className="p-2"><span className="text-2xl text-gray-400">×</span></button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Rotation Angle</label>
                <div className="grid grid-cols-4 gap-3">
                  {[90, 180, 270, 360].map((angle) => (
                    <button key={angle} onClick={() => setRotation(angle)} className={`py-3 rounded-xl font-medium transition-all ${rotation === angle ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <RotateCw className="w-5 h-5 mx-auto mb-1" />
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={rotatePDF} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Rotate PDF
              </button>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                <p className="text-lg font-medium">Rotating PDF...</p>
              </div>
            </div>
          </div>
        )}

        {status === 'completed' && downloadUrl && (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
              <div className="flex flex-col items-center gap-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <p className="text-lg font-medium">Rotation Complete!</p>
                <a href={downloadUrl} download="rotated.pdf" className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold">
                  Download PDF
                </a>
                <button onClick={reset} className="text-orange-600">Rotate another</button>
              </div>
            </div>
          </div>
        )}

        {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"><p className="text-sm text-red-600">{error}</p></div>}
      </main>

      {/* Tool Description Section */}
      <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
        <ToolDescription
          title="Rotate PDF: Fix Document Orientation Instantly"
          description="Rotate all pages in your PDF document to the correct orientation. Choose from 90°, 180°, or 270° rotation angles. Perfect for fixing scanned documents, photos, or PDFs that were created in the wrong orientation."
          features={[
            'Rotate all pages by 90°, 180°, or 270°',
            'Fix upside-down or sideways documents',
            'Preserve original quality and formatting',
            'Batch rotation for entire documents',
            'Fast processing with instant preview',
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
              title: 'Choose Rotation Angle',
              description:
                'Select the rotation angle: 90° (clockwise), 180° (upside-down), or 270° (counter-clockwise).',
            },
            {
              title: 'Rotate and Preview',
              description:
                'Click "Rotate PDF" to apply the rotation. The process is instant and you\'ll see the result immediately.',
            },
            {
              title: 'Download Rotated PDF',
              description:
                'Download your correctly oriented PDF file. All pages will have the same rotation applied.',
              },
          ]}
          faqs={[
            {
              question: 'Can I rotate individual pages differently?',
              answer:
                'Currently, all pages in the PDF are rotated by the same angle. For individual page rotation, you may need to split the PDF first, rotate each part separately, then merge them back together.',
            },
            {
              question: 'What rotation angles are available?',
              answer:
                'You can rotate by 90° (clockwise), 180° (upside-down), or 270° (counter-clockwise). These are the most common rotation needs for fixing document orientation.',
            },
            {
              question: 'Will the quality be affected by rotation?',
              answer:
                'No! PDF rotation only changes the page orientation metadata. The actual content quality remains exactly the same.',
            },
            {
              question: 'Can I rotate scanned documents?',
              answer:
                'Yes! This tool works perfectly for scanned PDFs and images embedded in PDFs. It\'s commonly used to fix upside-down scans.',
            },
            {
              question: 'Is there a limit to PDF size?',
              answer:
                'No size limits! You can rotate PDFs of any size, though very large files may take longer to process.',
            },
            {
              question: 'Can I undo the rotation?',
              answer:
                'Yes, simply rotate again by the same angle in the opposite direction, or use 180° to flip it back.',
            },
          ]}
        />
      </div>
    </div>
  )
}
