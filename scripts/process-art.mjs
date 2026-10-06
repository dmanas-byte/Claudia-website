/**
 * Turn the raw Higgsfield renders in art/ into web assets in public/film/.
 *   stills: art/raw/<src>.png  → public/film/<id>-1920.webp + <id>-1080.webp
 *   videos: art/video/<id>.mp4 → public/film/<id>.mp4 + .webm (H.264 and VP9, silent, palindrome loop)
 * Needs ffmpeg with libwebp and libx264.
 *
 *   node scripts/process-art.mjs
 */
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

/** plate id → raw still (art/raw/<file>.png). Keep in sync with src/content/film.ts */
const STILLS = {
  hero: '00-hero',
  tape: '01-tape',
  backpack: '02d-backpack-school',
  fighter: '03b-fighter-mma',
  architect: '04-architect',
  record: '05-record',
  round1: '06-round1',
  round2: '07-round2',
  round3: '08-round3',
  round4: '09-round4',
  round5: '10-round5',
  round6: '11-round6',
  terminal: '12-terminal',
  alert: '13-alert',
  corner: '14-corner',
  rig: '15-rig',
  apply: '16-apply',
  finale: '17-finale',
}
const VIDEOS = ['hero', 'backpack', 'terminal', 'finale']

const OUT = 'public/film'
mkdirSync(OUT, { recursive: true })
const ff = (...args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args])
const kb = (f) => Math.round(statSync(f).size / 1024)

for (const [id, src] of Object.entries(STILLS)) {
  const input = `art/raw/${src}.png`
  if (!existsSync(input)) {
    console.warn('missing', input)
    continue
  }
  for (const w of [1920, 1080]) {
    const out = `${OUT}/${id}-${w}.webp`
    ff('-i', input, '-vf', `scale=${w}:-2:flags=lanczos`, '-c:v', 'libwebp', '-quality', w > 1500 ? '74' : '70', '-compression_level', '6', out)
    console.log(out, kb(out), 'KB')
  }
}

for (const id of VIDEOS) {
  const input = `art/video/${id}.mp4`
  if (!existsSync(input)) {
    console.warn('missing', input)
    continue
  }
  // play forward then backward so the loop never jumps
  const out = `${OUT}/${id}.mp4`
  ff('-i', input, '-filter_complex', '[0:v]scale=1600:-2:flags=lanczos,fps=24,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]', '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-movflags', '+faststart', out)
  const outS = `${OUT}/${id}-720.mp4`
  ff('-i', input, '-filter_complex', '[0:v]scale=1280:-2:flags=lanczos,fps=24,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]', '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-movflags', '+faststart', outS)
  // VP9 copies for browsers without H.264 (some Chromium builds)
  for (const [w, crf, name] of [
    [1600, 36, `${OUT}/${id}.webm`],
    [1280, 38, `${OUT}/${id}-720.webm`],
  ]) {
    ff('-i', input, '-filter_complex', `[0:v]scale=${w}:-2:flags=lanczos,fps=24,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]`, '-map', '[v]', '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(crf), '-deadline', 'good', '-cpu-used', '2', '-row-mt', '1', name)
  }
  console.log(out, kb(out), 'KB |', outS, kb(outS), 'KB | webm', kb(`${OUT}/${id}.webm`), kb(`${OUT}/${id}-720.webm`), 'KB')
}
