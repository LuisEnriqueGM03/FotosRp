import { useState } from 'react'
import DropZone from './components/DropZone'
import PreviewList from './components/PreviewList'
import ResultList from './components/ResultList'

export interface UploadResult {
  filename: string
  url: string
  status: 'ok' | 'error'
  error?: string
}

function readAsBase64(file: File): Promise<{ name: string; data: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve({ name: file.name, data: result.split(',')[1] })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function App() {
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<UploadResult[]>([])
  const [processing, setProcessing] = useState(false)

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles])
    setResults([])
  }

  const handleConvert = async () => {
    setProcessing(true)
    setResults([])

    const fileData = await Promise.all(files.map(readAsBase64))

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: fileData }),
      })
      const data = await res.json()
      setResults(data.results)
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleReset = () => {
    setFiles([])
    setResults([])
  }

  return (
    <div className="relative min-h-screen bg-black text-neutral-200 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04]
        bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.8)_2px,rgba(0,0,0,0.8)_4px)]" />

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(234,179,8,1) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-yellow-400 tracking-[0.25em] uppercase
            [text-shadow:0_0_10px_rgba(234,179,8,0.5),0_0_20px_rgba(234,179,8,0.3)]">
            Fotos RP
          </h1>
          <p className="text-neutral-600 mt-2 text-xs tracking-[0.3em] uppercase">
            PNG / WebP / JPEG  →  GIF  →  Fivemanage
          </p>
        </header>

        <DropZone onFilesSelected={handleFilesSelected} />

        {files.length > 0 && (
          <PreviewList
            files={files}
            processing={processing}
            onConvert={handleConvert}
            onRemove={handleRemoveFile}
          />
        )}

        {results.length > 0 && (
          <ResultList results={results} onReset={handleReset} />
        )}
      </div>
    </div>
  )
}
