/** Tiny echo endpoint for testing the forms: VITE_FORM_ENDPOINT=http://localhost:8787/submit */
import { createServer } from 'node:http'
const PORT = Number(process.env.PORT || 8787)
createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.end()
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    console.log(new Date().toISOString(), req.method, req.url, body)
    if (req.url?.includes('fail')) {
      res.statusCode = 500
      return res.end('{"ok":false}')
    }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, received: body ? JSON.parse(body) : null }))
  })
}).listen(PORT, () => console.log(`mock endpoint on http://localhost:${PORT}/submit`))
