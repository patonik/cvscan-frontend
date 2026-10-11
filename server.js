import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

const API_TARGET = process.env.API_TARGET || 'http://localhost:8080'
const PORT = process.env.PORT || 3000
const DIST = path.join(__dirname, 'dist')

app.use('/api', createProxyMiddleware({ target: API_TARGET, changeOrigin: true }))

app.use(express.static(DIST))
app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')))

app.listen(PORT, () => {
  console.log(`candidate-service-ui listening on :${PORT}, proxying /api -> ${API_TARGET}`)
})
