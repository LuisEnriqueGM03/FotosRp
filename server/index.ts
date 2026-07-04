import express from 'express'
import multer from 'multer'
import cors from 'cors'
import sharp from 'sharp'
import axios from 'axios'
import { config } from 'dotenv'
import FormData from 'form-data'

config()

const app = express()
const upload = multer({ storage: multer.memoryStorage() })
const PORT = 3001

const apiKey = process.env.FIVEMANAGE_API_KEY

if (!apiKey || apiKey === 'tu_token_aqui') {
  console.error('❌ FIVEMANAGE_API_KEY no está configurada en el .env')
  console.error('   Editá el archivo .env y poné tu token real de fivemanage.com')
}

app.use(cors())

app.post('/api/convert', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[]

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const gifBuffer = await sharp(file.buffer)
            .gif()
            .toBuffer()

          const gifName = file.originalname.replace(/\.\w+$/, '.gif')

          const form = new FormData()
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

          return {
            filename: file.originalname,
            url: response.data.data.url,
            status: 'ok' as const,
          }
        } catch (err: unknown) {
          let errorMsg = 'Unknown error'

          if (axios.isAxiosError(err)) {
            errorMsg = `${err.response?.status ?? '?'} · ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`
          } else if (err instanceof Error) {
            errorMsg = err.message
          }

          return {
            filename: file.originalname,
            status: 'error' as const,
            error: errorMsg,
          }
        }
      })
    )

    res.json({ results })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Server error:', msg)
    res.status(500).json({ error: msg })
  }
})

app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`)
})
