interface Props {
  files: File[]
  processing: boolean
  onConvert: () => void
  onRemove: (index: number) => void
}

export default function PreviewList({ files, processing, onConvert, onRemove }: Props) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-yellow-400/80 text-sm tracking-[0.2em] uppercase font-semibold">
          Queue &nbsp;·&nbsp; {files.length} file{files.length !== 1 ? 's' : ''}
        </h2>

        <button
          onClick={onConvert}
          disabled={processing}
          className={`
            px-6 py-2 rounded-lg font-bold text-sm tracking-widest uppercase
            transition-all duration-300
            ${processing
              ? 'bg-yellow-400/20 text-yellow-400/40 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] active:scale-95'
            }
          `}
        >
          {processing ? 'Processing...' : '⚡ Convert & Upload All'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, idx) => (
          <div
            key={`${file.name}-${idx}`}
            className="relative group bg-zinc-900/80 border border-yellow-400/10 rounded-lg p-3
              hover:border-yellow-400/30 hover:shadow-[0_0_15px_rgba(234,179,8,0.08)]
              transition-all duration-200"
          >
            <button
              onClick={() => onRemove(idx)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800 border border-yellow-400/30
                text-yellow-400/70 text-xs flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-400 hover:text-black"
            >
              ✕
            </button>

            <div className="aspect-square rounded-md overflow-hidden bg-black mb-2 flex items-center justify-center">
              {file.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain"
                  onLoad={(e) => {
                    const img = e.currentTarget
                    setTimeout(() => URL.revokeObjectURL(img.src), 5000)
                  }}
                />
              )}
            </div>

            <p className="text-yellow-400/80 text-xs font-mono truncate">{file.name}</p>
            <p className="text-neutral-600 text-[10px] font-mono">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
