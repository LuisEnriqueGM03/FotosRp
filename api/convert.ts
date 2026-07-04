import sharp from 'sharp'
import axios from 'axios'
import FormData from 'form-data'

export default async function handler(
  req: { method: string; body: string | Record<string, unknown> },
  res: {
    status: (code: number) => { json: (data: unknown) => void }
    setHeader: (key: string, value: string) => void
  }
) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).json({})
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { files } = body as { files: { name: string; data: string }[] }

    const apiKey = process.env.FIVEMANAGE_API_KEY

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const buffer = Buffer.from(file.data, 'base64')
          const gifBuffer = await sharp(buffer).gif().toBuffer()

          const form = new FormData()
          const gifName = file.name.replace(/\.\w+$/, '.gif')
          form.append('file', gifBuffer, {
            filename: gifName,
            contentType: 'image/gif',
          })

          const response = await axios.post(
            'https://api.fivemanage.com/api/v3/file',
            form,
            {
              headers: {
                Authorization: `${apiKey}`,
                ...form.getHeaders(),
              },
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
            }
          )

          return { filename: file.name, url: response.data.data.url, status: 'ok' }
        } catch (err: unknown) {
          let errorMsg = 'Unknown error'
          if (axios.isAxiosError(err)) {
            errorMsg = `${err.response?.status ?? '?'} · ${JSON.stringify(err.response?.data ?? err.message)}`
          } else if (err instanceof Error) {
            errorMsg = err.message
          }
          return { filename: file.name, status: 'error', error: errorMsg }
        }
      })
    )

    res.status(200).json({ results })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: msg })
  }
}
