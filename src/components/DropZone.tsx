import { useCallback, useRef, useState } from 'react'

interface Props {
  onFilesSelected: (files: File[]) => void
}

const ACCEPTED = ['image/png', 'image/webp', 'image/jpeg']

export default function DropZone({ onFilesSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        ACCEPTED.includes(f.type)
      )
      if (files.length > 0) onFilesSelected(files)
    },
    [onFilesSelected],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) onFilesSelected(files)
      e.target.value = ''
    },
    [onFilesSelected],
  )

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-xl border-2 border-dashed p-16 text-center
        transition-all duration-300 select-none
        ${dragging
          ? 'border-yellow-400 bg-yellow-400/5 shadow-[0_0_30px_rgba(234,179,8,0.2)]'
          : 'border-yellow-400/30 bg-zinc-900/50 hover:border-yellow-400/60 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)]'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".png,.webp,.jpg,.jpeg"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3">
        <svg
          className={`w-12 h-12 transition-colors ${dragging ? 'text-yellow-400' : 'text-yellow-400/60'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p className="text-yellow-400/80 text-lg font-semibold tracking-widest uppercase">
          {dragging ? '⟐  SOLTAR ARCHIVOS  ⟐' : '⚡  DROP FILES HERE'}
        </p>

        <p className="text-neutral-600 text-sm tracking-wider">
          PNG · WebP · JPEG &nbsp;|&nbsp; o <span className="text-yellow-400/60 underline underline-offset-2">selecciona archivos</span>
        </p>
      </div>
    </div>
  )
}
