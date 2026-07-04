import { useState } from 'react'
import type { UploadResult } from '../App'

interface Props {
  results: UploadResult[]
  onReset: () => void
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`
        ml-3 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase
        transition-all duration-200 shrink-0
        ${copied
          ? 'bg-green-500 text-black'
          : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]'
        }
      `}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

export default function ResultList({ results, onReset }: Props) {
  const okCount = results.filter((r) => r.status === 'ok').length

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-yellow-400/80 text-sm tracking-[0.2em] uppercase font-semibold">
          Results &nbsp;·&nbsp; {okCount}/{results.length} uploaded
        </h2>

        <button
          onClick={onReset}
          className="text-neutral-600 text-xs tracking-wider uppercase hover:text-yellow-400/60 transition-colors"
        >
          ↻ New Upload
        </button>
      </div>

      <div className="space-y-2">
        {results.map((r, idx) => (
          <div
            key={idx}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg border
              transition-all duration-200
              ${r.status === 'ok'
                ? 'bg-zinc-900/80 border-yellow-400/10'
                : 'bg-red-900/20 border-red-500/20'
              }
            `}
          >
            <span className={`font-mono text-sm ${r.status === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
              {r.status === 'ok' ? '[✓]' : '[✗]'}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-yellow-400/70 text-xs font-mono truncate">{r.filename}</p>
              {r.status === 'ok' ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400/90 text-xs font-mono truncate block hover:text-yellow-300 hover:underline"
                >
                  {r.url}
                </a>
              ) : (
                <p className="text-red-400/70 text-xs font-mono truncate">{r.error}</p>
              )}
            </div>

            {r.status === 'ok' && <CopyButton url={r.url} />}
          </div>
        ))}
      </div>
    </div>
  )
}
