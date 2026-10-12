// One-off B6 evidence collector. It deliberately fails on unreviewed differences.
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import http from 'node:http'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repo = process.cwd()
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => i % 2 ? a : [...a, [v, all[i + 1]]], []))
const out = path.resolve(args['--output'] || 'docs-css-evidence')
// Temporary upgrade acceptance: retire this collector after actual-main evidence is accepted.
const baselineCommit = '2a778ac50e98852649549712357f0be27d73ac99'
const trees = { baseline: 'c61529de370cffd8f68b15096c93bc7b08cb4eda' }
const dependencyBlobs = {
  'pnpm-lock.yaml': 'bea68669dd1d0248ea8d6b009e0d82d4376d88dc',
  'pnpm-workspace.yaml': '9444f66ce7848fc66fbbac2a8186300a7516e1a8',
}
const validationFiles = ['.github/workflows/ci.yml', 'scripts/compare-docs-css.mjs']
const sides = ['baseline', 'candidate']
const themes = ['light', 'dark']
const frameworks = ['react', 'vue', 'solid', 'svelte']
const sha256 = b => createHash('sha256').update(b).digest('hex')
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const manifest = { started: new Date().toISOString(), node: process.version, argv: process.argv, expectedBaselineTree: trees.baseline, expectedDependencyBlobs: dependencyBlobs, commands: [], sides: {}, cleanupErrors: [], result: 'collection-failed' }
const servers = []
const ownedWorktrees = []
let temporaryRoot
let browser
await fs.mkdir(out, { recursive: true })
async function write(name, value) {
  const destination = path.join(out, name)
  await fs.writeFile(`${destination}.tmp`, `${JSON.stringify(value, null, 2)}\n`)
  await fs.rename(`${destination}.tmp`, destination)
}
async function persist(stage) {
  manifest.stage = stage
  manifest.updatedAt = new Date().toISOString()
  await write('manifest.json', manifest)
}
async function command(argv, cwd = repo, log, timeoutMs = 60000) {
  const entry = { argv, cwd, started: new Date().toISOString(), status: 'running', timeoutMs }
  manifest.commands.push(entry)
  await persist(`command:${log || argv.join(' ')}`)
  let text = ''
  const stdout = log && createWriteStream(path.join(out, `${log}.stdout`))
  const stderr = log && createWriteStream(path.join(out, `${log}.stderr`))
  const child = spawn(argv[0], argv.slice(1), { cwd, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] })
  const timer = setTimeout(() => {
    entry.timedOut = true
    try {
      if (process.platform === 'win32')
        child.kill('SIGKILL')
      else if (child.pid)
        process.kill(-child.pid, 'SIGKILL') // Only this invocation's isolated process group.
    }
    catch (error) {
      if (error.code !== 'ESRCH')
        entry.terminationError = String(error)
    }
  }, timeoutMs)
  child.stdout.on('data', b => stdout ? stdout.write(b) : text += b)
  child.stderr.on('data', b => stderr ? stderr.write(b) : text += b)
  try {
    entry.exitCode = await new Promise((resolve, reject) => {
      child.once('error', reject)
      child.once('close', (code, signal) => {
        entry.signal = signal
        resolve(code)
      })
    })
    entry.status = entry.timedOut ? 'timed-out' : entry.exitCode === 0 ? 'completed' : 'failed'
  }
  catch (error) {
    entry.status = 'spawn-failed'
    entry.error = String(error)
    throw error
  }
  finally {
    clearTimeout(timer)
    if (stdout)
      await new Promise(resolve => stdout.end(resolve))
    if (stderr)
      await new Promise(resolve => stderr.end(resolve))
    entry.finished = new Date().toISOString()
    await persist(`command-finished:${log || argv[0]}`)
  }
  assert.equal(entry.exitCode, 0, `command failed: ${argv.join(' ')}; see ${log || text}`)
  assert(!entry.timedOut, `command timed out: ${argv.join(' ')}`)
  return text.trim()
}
async function cleanup(label, action, timeoutMs = 10000) {
  let timer
  try {
    await Promise.race([action(), new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('cleanup timeout')), timeoutMs)
    })])
  }
  catch (error) {
    manifest.cleanupErrors.push({ label, error: String(error) })
    if (!process.exitCode)
      process.exitCode = 1
  }
  finally { clearTimeout(timer) }
}
async function hashInputs(dir, entries, requireGitMatch = false) {
  const records = {}
  for (const { name, mode, gitBlob } of entries) {
    const stat = await fs.lstat(path.join(dir, name))
    const type = stat.isSymbolicLink() ? 'symlink' : stat.isFile() ? 'file' : 'unsupported'
    assert(type !== 'unsupported', `unsupported tracked entry: ${name}`)
    const bytes = type === 'symlink' ? Buffer.from(await fs.readlink(path.join(dir, name))) : await fs.readFile(path.join(dir, name))
    const actualMode = type === 'symlink' ? '120000' : stat.mode & 0o111 ? '100755' : '100644'
    const actualGitBlob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
    if (requireGitMatch) {
      assert.equal(actualMode, mode)
      assert.equal(actualGitBlob, gitBlob, name)
    }
    records[name] = { mode, gitBlob, type, actualMode, actualGitBlob, sha256: sha256(bytes), ...(type === 'symlink' ? { target: bytes.toString() } : {}) }
  }
  return records
}
async function hashFiles(dir, names) {
  const records = {}
  for (const name of names) records[name] = sha256(await fs.readFile(path.join(dir, name)))
  return records
}
async function filesUnder(dir, prefix = '') {
  const result = []
  for (const entry of await fs.readdir(path.join(dir, prefix), { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name)
    if (entry.isDirectory())
      result.push(...await filesUnder(dir, name))
    else if (entry.isFile())
      result.push(name)
    else throw new Error(`unexpected output file type: ${name}`)
  }
  return result.sort()
}
async function serve(dir) {
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' }
  const server = http.createServer(async (req, res) => {
    try {
      let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      if (name.endsWith('/'))
        name += 'index.html'
      const file = path.resolve(dir, `.${name}`)
      assert(file.startsWith(`${dir}${path.sep}`), 'path outside docs output')
      const real = await fs.realpath(file)
      assert(real.startsWith(`${dir}${path.sep}`), 'symlink outside docs output')
      assert((await fs.stat(real)).isFile())
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
      createReadStream(real).pipe(res)
    }
    catch {
      res.writeHead(404)
      res.end('Not found')
    }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  servers.push(server)
  return `http://127.0.0.1:${server.address().port}`
}

// This inventory is declared before either browser context runs. No intersection-only comparison.
const inventory = []
const add = (route, theme, framework, target, state, visible = true) => inventory.push({ id: [route, theme, framework, target, state].join('|'), route, theme, framework, target, state, visible })
for (const theme of themes) {
  for (const section of ['hero', 'cta']) {
    add('/', theme, '-', `${section}.decoration`, 'idle')
    for (const state of ['idle', 'hover', 'active']) {
      for (const target of ['primary', 'arrow', 'underline']) add('/', theme, '-', `${section}.${target}`, state)
    }
    for (const state of ['idle', 'active']) add('/', theme, '-', `${section}.secondary`, state)
  }
  for (const target of ['theme-icon', 'framework-icon']) add('/', theme, '-', target, 'idle')
  for (const direction of ['prev', 'next']) {
    for (const state of ['idle', 'hover']) {
      for (const target of ['link', 'arrow']) add('/components/checkbox/', theme, '-', `${direction}.${target}`, state)
    }
  }
  for (const framework of frameworks) {
    for (const state of ['unchecked', 'checked', 'unchecked-again']) {
      for (const target of ['frame', 'control', 'indicator']) add('/components/checkbox/', theme, framework, target, state, target !== 'indicator' || state === 'checked')
    }
  }
  for (const state of ['closed', 'open', 'closed-again']) {
    add('/components/hover-card/', theme, 'vue', 'trigger', state)
    add('/components/hover-card/', theme, 'vue', 'content', state, state === 'open')
  }
}
const screenshotIds = [
  ...['idle', 'hover', 'active'].map(state => `/|light|-|hero.primary|${state}`),
  '/|dark|-|hero.primary|idle',
  ...themes.map(theme => `/components/checkbox/|${theme}|vue|frame|checked`),
  ...['prev', 'next'].map(direction => `/components/checkbox/|light|-|${direction}.arrow|hover`),
]
assert.equal(new Set(inventory.map(x => x.id)).size, inventory.length)
assert.equal(screenshotIds.length, 8)

async function snapshot(locator) {
  return locator.evaluate((el) => {
    const s = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const p = el.parentElement.getBoundingClientRect()
    const rect = v => ({ x: v.x, y: v.y, width: v.width, height: v.height })
    const matrix = Array.from(new DOMMatrix(s.transform === 'none' ? undefined : s.transform).toFloat64Array())
    if (matrix.length !== 16 || !matrix.every(Number.isFinite))
      throw new Error('invalid transform matrix')
    const effectiveOpacity = (node) => {
      let opacity = 1
      for (let current = node; current; current = current.parentElement) opacity *= Number(getComputedStyle(current).opacity)
      return opacity
    }
    const paintedColor = (color) => {
      if (color === 'none' || color === 'transparent')
        return false
      const alpha = /\/\s*([^/()\s]+)\s*\)$/.exec(color)
        || /^(?:rgba|hsla)\([^,]+,[^,]+,[^,]+,\s*([^,()\s]+)\s*\)$/.exec(color)
      return alpha ? Number.parseFloat(alpha[1]) > 0 : true
    }
    const svgEvidence = [...el.querySelectorAll('svg')].map((svg) => {
      const clone = svg.cloneNode(true)
      const nodes = [clone, ...clone.querySelectorAll('*')]
      const ids = new Map(nodes.filter(n => n.id).map((n, i) => [n.id, `local-svg-id-${i}`]))
      for (const node of nodes) {
        for (const attribute of [...node.attributes]) {
          let value = attribute.value
          if (attribute.name === 'id')
            value = ids.get(value)
          else if (['href', 'xlink:href'].includes(attribute.name) && value.startsWith('#') && ids.has(value.slice(1)))
            value = `#${ids.get(value.slice(1))}`
          else if (['aria-labelledby', 'aria-describedby'].includes(attribute.name))
            value = value.split(/\s+/).map(id => ids.get(id) || id).join(' ')
          else value = value.replace(/url\(["']?#([^"')]+)["']?\)/g, (raw, id) => ids.has(id) ? `url(#${ids.get(id)})` : raw)
          node.setAttribute(attribute.name, value)
        }
      }
      const svgRect = svg.getBoundingClientRect()
      const drawing = [...svg.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon,text,use')].map((shape) => {
        const style = getComputedStyle(shape)
        const bounds = shape.getBoundingClientRect()
        let bbox
        try {
          bbox = rect(shape.getBBox())
        }
        catch { bbox = null }
        const opacity = effectiveOpacity(shape)
        const strokePaints = paintedColor(style.stroke) && Number.parseFloat(style.strokeWidth) > 0 && Number(style.strokeOpacity) > 0
        const fillPaints = paintedColor(style.fill) && Number(style.fillOpacity) > 0
        return {
          tag: shape.tagName,
          visibility: style.visibility,
          display: style.display,
          opacity: style.opacity,
          effectiveOpacity: opacity,
          stroke: style.stroke,
          fill: style.fill,
          strokeWidth: style.strokeWidth,
          strokeOpacity: style.strokeOpacity,
          fillOpacity: style.fillOpacity,
          bounds: { ...rect(bounds), x: bounds.x - svgRect.x, y: bounds.y - svgRect.y },
          bbox,
          paints: style.display !== 'none' && style.visibility === 'visible' && opacity > 0 && svgRect.width > 0 && svgRect.height > 0 && (bounds.width > 0 || bounds.height > 0) && (strokePaints || fillPaints) && !!bbox && (bbox.width > 0 || bbox.height > 0),
        }
      })
      return { raw: svg.outerHTML, normalized: clone.outerHTML, bounds: rect(svgRect), drawing }
    })
    const custom = Object.fromEntries([...s].filter(k => k.startsWith('--un-')).sort().map(k => [k, s.getPropertyValue(k)]))
    custom['--un-perspective'] = s.getPropertyValue('--un-perspective')
    return {
      tag: el.tagName,
      classes: el.className?.baseVal ?? el.className,
      theme: document.documentElement.dataset.theme,
      framework: document.documentElement.dataset.framework,
      rect: rect(r),
      documentRect: { ...rect(r), x: r.x + scrollX, y: r.y + scrollY },
      parentRect: rect(p),
      matrix,
      transform: s.transform,
      transformOrigin: s.transformOrigin,
      custom,
      color: s.color,
      backgroundColor: s.backgroundColor,
      borderColor: s.borderColor,
      opacity: s.opacity,
      effectiveOpacity: effectiveOpacity(el),
      display: s.display,
      visibility: s.visibility,
      maskImage: s.maskImage,
      backgroundImage: s.backgroundImage,
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      fontStyle: s.fontStyle,
      transitionDuration: s.transitionDuration,
      transitionDelay: s.transitionDelay,
      visible: s.display !== 'none' && s.visibility === 'visible' && effectiveOpacity(el) > 0 && r.width > 0 && r.height > 0,
      hover: el.matches(':hover'),
      active: el.matches(':active'),
      checked: el.getAttribute('data-state'),
      text: el.textContent.trim(),
      svg: svgEvidence,
      before: { width: getComputedStyle(el, '::before').width, backgroundColor: getComputedStyle(el, '::before').backgroundColor },
    }
  })
}
function stable(a, b) {
  return ['x', 'y', 'width', 'height'].every(k => Math.abs(a.rect[k] - b.rect[k]) <= 0.05)
    && a.matrix.length === b.matrix.length && a.matrix.every((v, i) => Math.abs(v - b.matrix[i]) <= 1e-6)
    && Math.abs(a.effectiveOpacity - b.effectiveOpacity) <= 1e-6
    && ['transformOrigin', 'color', 'backgroundColor', 'opacity', 'display', 'visibility', 'maskImage'].every(k => a[k] === b[k])
    && JSON.stringify(a.custom) === JSON.stringify(b.custom)
    && JSON.stringify(a.svg) === JSON.stringify(b.svg)
}
async function settled(page, locator, stateTarget, state) {
  assert.equal(await locator.count(), 1, 'missing or ambiguous target')
  const requestedState = (el, state) => state === 'idle' ? !el.matches(':hover,:active') : el.matches(`:${state}`)
  if (stateTarget) {
    assert.equal(await stateTarget.count(), 1)
    assert(await stateTarget.evaluate(requestedState, state), `requested ${state} state missing`)
  }
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const started = Date.now()
  let previous = await snapshot(locator)
  const milliseconds = value => value.split(',').map(s => Number.parseFloat(s) * (s.trim().endsWith('ms') ? 1 : 1000))
  const delay = Math.max(...milliseconds(previous.transitionDuration)) + Math.max(...milliseconds(previous.transitionDelay))
  assert(delay < 1800, 'transition exceeds collection deadline')
  await sleep(delay)
  let count = 0
  while (Date.now() - started < 2000) {
    await sleep(50)
    const current = await snapshot(locator)
    count = stable(previous, current) ? count + 1 : 0
    if (count >= 3) {
      if (stateTarget)
        assert(await stateTarget.evaluate(requestedState, state), `requested ${state} state changed`)
      return current
    }
    previous = current
  }
  throw new Error('style/rectangle did not settle within 2 seconds')
}

async function collect(side, origin) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'UTC', colorScheme: 'light', reducedMotion: 'no-preference' })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const result = { origin, samples: {}, console: [], network: [], pageErrors: [], coverage: [], fonts: [], screenshots: [] }
  manifest.sides[side].origin = origin
  page.on('console', m => result.console.push({ type: m.type(), text: m.text() }))
  page.on('pageerror', e => result.pageErrors.push(String(e)))
  page.on('requestfailed', r => result.network.push({ url: r.url(), local: r.url().startsWith(`${origin}/`), error: r.failure()?.errorText }))
  page.on('response', (r) => {
    if (r.status() >= 400)
      result.network.push({ url: r.url(), local: r.url().startsWith(`${origin}/`), status: r.status() })
  })
  const check = () => {
    assert.equal(result.pageErrors.length, 0, `page error on ${side}`)
    assert.equal(result.network.filter(x => x.local).length, 0, `local asset error on ${side}`)
  }
  async function go(route, theme) {
    assert.equal((await page.goto(`${origin}${route}`, { waitUntil: 'load' })).status(), 200)
    if (await page.locator('html').getAttribute('data-theme') !== theme)
      await page.locator('#ds-theme-toggle').click()
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme)
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((_, reject) => setTimeout(() => reject(new Error('font readiness timeout')), 10000))]))
    check()
  }
  async function switchFramework(fw) {
    await page.locator('#ds-fw-trigger').click()
    await page.locator(`[data-framework-option="${fw}"]`).click()
    assert.equal(await page.locator('html').getAttribute('data-framework'), fw)
    assert.equal(await page.locator('#ds-fw-trigger').getAttribute('aria-expanded'), 'false')
  }
  async function save(route, theme, fw, target, state, locator, stateTarget, pseudo) {
    const id = [route, theme, fw, target, state].join('|')
    const expected = inventory.find(x => x.id === id)
    assert(expected && !(id in result.samples), `unexpected or duplicate sample ${id}`)
    if (state === 'idle') {
      stateTarget ||= locator
      pseudo = 'idle'
    }
    const validState = (sample) => {
      assert.equal(sample.theme, theme)
      assert.equal(sample.visible, expected.visible, `visibility ${id}`)
      if (fw !== '-')
        assert.equal(sample.framework, fw)
      if (route === '/components/hover-card/')
        assert.equal(sample.checked, state === 'open' ? 'open' : 'closed', `popup data-state ${id}`)
      if (route === '/components/checkbox/' && ['control', 'indicator'].includes(target))
        assert.equal(sample.checked, state === 'checked' ? 'checked' : 'unchecked', `checkbox data-state ${id}`)
    }
    let sample = await settled(page, locator, stateTarget, pseudo)
    validState(sample)
    // Verify required imported faces with Latin text independently of symbol fallback.
    if (sample.visible) {
      const font = await locator.evaluate(async (el) => {
        const s = getComputedStyle(el)
        const clean = family => family.trim().replaceAll('"', '').replaceAll('\'', '')
        const stack = s.fontFamily.split(',').map(clean)
        // These are the actual families imported by docs/src/styles/tokens.css.
        const imported = ['Inter Tight', 'Inter', 'JetBrains Mono', 'Playfair Display']
        const requiredFamily = stack.find(family => imported.includes(family))
        const targetText = el.textContent.trim().slice(0, 100)
        const result = { stack, requiredFamily, targetText, glyphFallback: 'Actual glyph font is not inferred from FontFaceSet; fallback is permitted.' }
        const describe = faces => faces.map(f => ({ family: clean(f.family), status: f.status, weight: f.weight, style: f.style, unicodeRange: f.unicodeRange }))
        const load = (request, text) => Promise.race([document.fonts.load(request, text), new Promise((_, reject) => setTimeout(() => reject(new Error('required font load timeout')), 10000))])
        try {
          if (requiredFamily) {
            result.requiredRequest = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} "${requiredFamily}"`
            result.requiredText = 'Destyler UI ABCabc012'
            result.requiredFaces = describe(await load(result.requiredRequest, result.requiredText))
            result.requiredCheck = document.fonts.check(result.requiredRequest, result.requiredText)
            const weight = Number(s.fontWeight)
            result.requiredLoaded = result.requiredCheck && result.requiredFaces.some((face) => {
              const range = face.weight.split(/\s+/).map(Number)
              return face.family === requiredFamily && face.status === 'loaded' && face.style === s.fontStyle && range.every(Number.isFinite) && weight >= range[0] && weight <= range.at(-1)
            })
          }
          else {
            result.requiredLoaded = true
          } // System/generic stacks have no required imported face.
          const firstRequest = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} "${stack[0]}"`
          result.targetFirstFamilyFaces = describe(await load(firstRequest, targetText || 'UI'))
          result.targetFirstFamilyCheck = document.fonts.check(firstRequest, targetText || 'UI')
        }
        catch (error) {
          result.error = String(error)
          result.requiredLoaded = false
        }
        return result
      })
      result.fonts.push({ id, ...font })
      assert(font.requiredLoaded, `required font unavailable: ${id} ${font.requiredFamily}: ${font.error || 'face metadata mismatch'}`)
      // Loading a required face can change layout; collect again only after it has loaded.
      sample = await settled(page, locator, stateTarget, pseudo)
      validState(sample)
    }
    const images = await locator.locator('img').evaluateAll(images => images.map(i => ({ src: i.currentSrc, complete: i.complete, naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight, loading: i.loading })))
    assert(images.every(i => i.complete && i.naturalWidth > 0), `required image incomplete: ${id}`)
    sample.images = images
    if (target.endsWith('arrow') && route !== '/')
      assert(sample.maskImage !== 'none' || sample.backgroundImage !== 'none', `missing icon: ${id}`)
    if (target.endsWith('icon'))
      assert(sample.maskImage !== 'none' || sample.backgroundImage !== 'none', `missing icon: ${id}`)
    if (target === 'indicator' && state === 'checked') {
      assert(sample.text || sample.svg.length, `empty checked indicator ${id}`)
      for (const svg of sample.svg) assert(svg.bounds.width > 0 && svg.bounds.height > 0 && svg.drawing.some(shape => shape.paints), `nonpainting checked SVG ${id}`)
    }
    result.samples[id] = sample
    if (screenshotIds.includes(id)) {
      const number = screenshotIds.indexOf(id)
      const file = `${side}-${number}.png`
      // Target screenshots preserve the state and do not introduce scrolling.
      const r = sample.rect
      const clip = { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: Math.min(1280, r.x + r.width + 8) - Math.max(0, r.x - 8), height: Math.min(900, r.y + r.height + 8) - Math.max(0, r.y - 8) }
      assert(clip.width > 0 && clip.height > 0)
      await page.screenshot({ path: path.join(out, file), clip })
      result.screenshots.push({ id, file, clip, sha256: sha256(await fs.readFile(path.join(out, file))) })
    }
    result.coverage.push({ id, nonHits: await page.evaluate(() => {
      const attributes = ['group-hover:-translate-x-0.5', 'group-hover:translate-x-0.5']
      const attributifyGroupHover = Object.fromEntries(attributes.map((attribute) => {
        const elements = [...document.querySelectorAll(`[${CSS.escape(attribute)}=""]`)].map((el) => {
          const groups = []
          for (let p = el.parentElement; p; p = p.parentElement) {
            if (p.classList.contains('group'))
              groups.push({ hovered: p.matches(':hover'), html: p.outerHTML.slice(0, 200) })
          }
          return { value: el.getAttribute(attribute), html: el.outerHTML.slice(0, 500), ancestorGroups: groups, activeMatch: groups.some(g => g.hovered) }
        })
        return [attribute, { count: elements.length, elements }]
      }))
      return { translateXHalf: document.querySelectorAll('[class~="-translate-x-1/2"]').length, transform: document.querySelectorAll('.transform').length, attributifyGroupHover, openDelay: [...document.querySelectorAll('[open-delay]')].map(el => ({ value: el.getAttribute('open-delay'), open: el.matches('[open]'), popoverOpen: el.matches(':popover-open'), nativeOpen: CSS.supports('selector(:open)') ? el.matches(':open') : 'unsupported', html: el.outerHTML.slice(0, 500) })) }
    }) })
    check()
    await write(`${side}.json`, result)
    await persist(`collected:${side}:${id}`)
  }
  try {
    for (const theme of themes) {
      await go('/', theme)
      for (const [index, section] of ['hero', 'cta'].entries()) {
        const box = page.locator('section').filter({ has: page.locator('a[class~="active:translate-y-px"][href="/overview/getting-started/"]') }).nth(index)
        const primary = box.locator('a[href="/overview/getting-started/"]')
        const secondary = box.locator('a[href="https://github.com/destyler/ui"]')
        await primary.scrollIntoViewIfNeeded()
        await page.mouse.move(0, 0)
        await save('/', theme, '-', `${section}.decoration`, 'idle', box.locator('[class~="-translate-y-1/2"]'))
        for (const state of ['idle', 'hover', 'active']) {
          if (state !== 'idle')
            await primary.hover()
          if (state === 'active')
            await page.mouse.down()
          for (const [target, locator] of [['primary', primary], ['arrow', primary.locator('[class~="group-hover:translate-x-1"]')], ['underline', primary.locator('[class~="scale-x-100"]')]]) await save('/', theme, '-', `${section}.${target}`, state, locator, primary, state)
          if (state === 'active') {
            await page.mouse.move(0, 0)
            await page.mouse.up()
          }
        }
        for (const state of ['idle', 'active']) {
          await secondary.scrollIntoViewIfNeeded()
          await page.mouse.move(0, 0)
          if (state === 'active') {
            await secondary.hover()
            await page.mouse.down()
          }
          await save('/', theme, '-', `${section}.secondary`, state, secondary, secondary, state)
          if (state === 'active') {
            await page.mouse.move(0, 0)
            await page.mouse.up()
          }
        }
        assert.equal(new URL(page.url()).pathname, '/')
      }
      const themeIcon = page.locator(theme === 'light' ? '#ds-theme-toggle .ds-icon-moon' : '#ds-theme-toggle .ds-icon-sun')
      await themeIcon.scrollIntoViewIfNeeded()
      await page.mouse.move(0, 0)
      await save('/', theme, '-', 'theme-icon', 'idle', themeIcon, page.locator('#ds-theme-toggle'), 'idle')
      const frameworkIcon = page.locator('section').first().locator('.i-tabler-brand-react')
      await frameworkIcon.scrollIntoViewIfNeeded()
      await save('/', theme, '-', 'framework-icon', 'idle', frameworkIcon)
      await go('/components/checkbox/', theme)
      for (const direction of ['prev', 'next']) {
        const link = page.locator(`nav[aria-label="Pagination"] a[rel="${direction}"]`)
        await link.scrollIntoViewIfNeeded()
        for (const state of ['idle', 'hover']) {
          await page.mouse.move(0, 0)
          if (state === 'hover')
            await link.hover()
          await save('/components/checkbox/', theme, '-', `${direction}.link`, state, link, link, state)
          await save('/components/checkbox/', theme, '-', `${direction}.arrow`, state, link.locator('span[aria-hidden="true"]'), link, state)
        }
      }
      for (const fw of frameworks) {
        await switchFramework(fw)
        const container = page.locator('.ds-component-preview').first()
        const frame = container.locator(`.ds-preview-frame.checkbox-basic[data-fw="${fw}"]`)
        await frame.scrollIntoViewIfNeeded()
        await frame.locator('astro-island:not([ssr])').waitFor()
        assert.equal(await container.locator('.ds-preview-frame:visible').count(), 1)
        const control = frame.locator('[data-scope="checkbox"][data-part="control"]')
        for (const state of ['unchecked', 'checked', 'unchecked-again']) {
          if (state !== 'unchecked')
            await control.click()
          const checked = state === 'checked'
          await page.waitForFunction(({ selector, checked }) => document.querySelector(selector)?.getAttribute('data-state') === (checked ? 'checked' : 'unchecked'), { selector: `.ds-component-preview .checkbox-basic[data-fw="${fw}"] [data-scope="checkbox"][data-part="control"]`, checked })
          await page.mouse.move(0, 0)
          for (const [target, locator] of [['frame', frame], ['control', control], ['indicator', frame.locator('[data-scope="checkbox"][data-part="indicator"]')]]) await save('/components/checkbox/', theme, fw, target, state, locator)
        }
      }
      await go('/components/hover-card/', theme)
      await switchFramework('vue')
      const frame = page.locator('.ds-component-preview').first().locator('.hover-card-basic[data-fw="vue"]')
      await frame.scrollIntoViewIfNeeded()
      await frame.locator('astro-island:not([ssr])').waitFor()
      const trigger = frame.locator('[data-scope="hover-card"][data-part="trigger"]')
      // @destyler/hover-card 0.2.11 uses paired IDs; it does not emit aria-controls.
      const triggerId = await trigger.getAttribute('id')
      assert.match(triggerId || '', /^hover-card:.+:trigger$/)
      const contentId = `${triggerId.slice(0, -'trigger'.length)}content`
      const content = page.locator(`[id="${contentId.replaceAll('"', '\\"')}"]`)
      for (const state of ['closed', 'open', 'closed-again']) {
        const started = Date.now()
        if (state === 'open')
          await trigger.hover()
        else await page.mouse.move(0, 0)
        await content.waitFor({ state: state === 'open' ? 'visible' : 'hidden' })
        const elapsed = Date.now() - started
        await save('/components/hover-card/', theme, 'vue', 'trigger', state, trigger, trigger, state === 'open' ? 'hover' : 'idle')
        await save('/components/hover-card/', theme, 'vue', 'content', state, content, trigger, state === 'open' ? 'hover' : 'idle')
        result.samples[`/components/hover-card/|${theme}|vue|content|${state}`].elapsedObservationMs = elapsed
      }
    }
    assert.deepEqual(Object.keys(result.samples).sort(), inventory.map(x => x.id).sort(), 'incomplete expected inventory')
    assert.equal(result.screenshots.length, 8)
    for (const record of result.coverage) {
      const n = record.nonHits
      assert.equal(n.translateXHalf + n.transform + Object.values(n.attributifyGroupHover).reduce((sum, entry) => sum + entry.count, 0) + n.openDelay.length, 0, `new non-hit selector match needs review: ${record.id}`)
    }
    check()
    return result
  }
  finally {
    await write(`${side}.json`, result)
    await cleanup(`context:${side}`, () => context.close())
  }
}

function compare(a, b, assetsA, assetsB) {
  const differences = []
  const addDiff = (id, field, before, after) => differences.push({ id, field, before, after, classification: 'review-required' })
  function resourceValue(value, origin, assets) {
    if (!value.startsWith(`${origin}/`))
      return value
    const file = decodeURIComponent(new URL(value).pathname.slice(1))
    assert(assets[file], `unverified local image resource ${file}`)
    return `sha256:${assets[file]}`
  }
  function imageValue(value, origin, assets) {
    return value.replaceAll(/url\(["']?([^"')]+)["']?\)/g, (raw, url) => {
      if (!url.startsWith(`${origin}/`))
        return raw
      return `url(${resourceValue(url, origin, assets)})`
    })
  }
  function drawingBounds(id, field, x, y) {
    if (!x || !y) {
      if (x !== y)
        addDiff(id, field, x, y)
      return
    }
    for (const key of ['x', 'y', 'width', 'height']) {
      assert(Number.isFinite(x[key]) && Number.isFinite(y[key]), `invalid SVG bounds: ${id}`)
      if (Math.abs(x[key] - y[key]) > 0.5)
        addDiff(id, `${field}.${key}`, x[key], y[key])
    }
  }
  for (const { id } of inventory) {
    const x = a.samples[id]
    const y = b.samples[id]
    for (const field of ['color', 'backgroundColor', 'borderColor', 'opacity', 'effectiveOpacity', 'display', 'visibility', 'visible', 'checked', 'hover', 'active', 'text', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'transitionDuration', 'transitionDelay']) {
      if (x[field] !== y[field])
        addDiff(id, field, x[field], y[field])
    }
    for (const field of ['rect', 'documentRect', 'parentRect']) {
      for (const key of ['x', 'y', 'width', 'height']) {
        if (Math.abs(x[field][key] - y[field][key]) > 0.5)
          addDiff(id, `${field}.${key}`, x[field][key], y[field][key])
      }
    }
    assert(x.matrix.length === 16 && y.matrix.length === 16 && x.matrix.every(Number.isFinite) && y.matrix.every(Number.isFinite), `invalid numeric matrix ${id}`)
    if (x.matrix.some((v, i) => Math.abs(v - y.matrix[i]) > 1e-6))
      addDiff(id, 'transform', x.transform, y.transform)
    const originX = x.transformOrigin.split(' ').map(Number.parseFloat)
    const originY = y.transformOrigin.split(' ').map(Number.parseFloat)
    if (originX.length !== originY.length || originX.some((v, i) => Math.abs(v - originY[i]) > 0.5))
      addDiff(id, 'transformOrigin', x.transformOrigin, y.transformOrigin)
    for (const field of ['custom', 'before']) {
      if (JSON.stringify(x[field]) !== JSON.stringify(y[field]))
        addDiff(id, field, x[field], y[field])
    }
    for (const field of ['maskImage', 'backgroundImage']) {
      if (imageValue(x[field], a.origin, assetsA) !== imageValue(y[field], b.origin, assetsB))
        addDiff(id, field, x[field], y[field])
    }
    if (x.svg.length !== y.svg.length)
      addDiff(id, 'svg.length', x.svg.length, y.svg.length)
    for (let i = 0; i < Math.min(x.svg.length, y.svg.length); i++) {
      const xs = x.svg[i]
      const ys = y.svg[i]
      if (xs.normalized !== ys.normalized)
        addDiff(id, `svg.${i}.normalized`, xs.normalized, ys.normalized)
      drawingBounds(id, `svg.${i}.bounds`, xs.bounds, ys.bounds)
      if (xs.drawing.length !== ys.drawing.length)
        addDiff(id, `svg.${i}.drawing.length`, xs.drawing.length, ys.drawing.length)
      for (let j = 0; j < Math.min(xs.drawing.length, ys.drawing.length); j++) {
        const xd = xs.drawing[j]
        const yd = ys.drawing[j]
        for (const key of Object.keys(xd).filter(k => !['bounds', 'bbox'].includes(k))) {
          if (xd[key] !== yd[key])
            addDiff(id, `svg.${i}.drawing.${j}.${key}`, xd[key], yd[key])
        }
        drawingBounds(id, `svg.${i}.drawing.${j}.bounds`, xd.bounds, yd.bounds)
        drawingBounds(id, `svg.${i}.drawing.${j}.bbox`, xd.bbox, yd.bbox)
      }
    }
    const imagesA = x.images.map(image => ({ ...image, src: resourceValue(image.src, a.origin, assetsA) }))
    const imagesB = y.images.map(image => ({ ...image, src: resourceValue(image.src, b.origin, assetsB) }))
    if (JSON.stringify(imagesA) !== JSON.stringify(imagesB))
      addDiff(id, 'images', x.images, y.images)
  }
  return differences
}

try {
  manifest.scriptSha256 = sha256(await fs.readFile(fileURLToPath(import.meta.url)))
  await write('coverage.json', { inventory, screenshotIds, limits: 'Chromium; three routes; four absent transform selectors and two open-delay rules remain untested if no hits' })
  await persist('validating-inputs')
  for (const side of sides) assert.match(args[`--${side}`] || '', /^[a-f0-9]{40}$/, `provide exact ${side} commit SHA`)
  assert.equal(args['--baseline'], baselineCommit, 'use the accepted baseline commit')
  assert.equal(args['--candidate'], await command(['git', 'rev-parse', 'HEAD']), 'candidate must be the actual CI checkout')
  trees.candidate = await command(['git', 'rev-parse', `${args['--candidate']}^{tree}`])
  for (const side of sides) {
    const commit = args[`--${side}`]
    assert.equal(await command(['git', 'rev-parse', `${commit}^{commit}`]), commit)
    assert.equal(await command(['git', 'rev-parse', `${commit}^{tree}`]), trees[side])
  }
  await command(['git', 'merge-base', '--is-ancestor', baselineCommit, args['--candidate']])
  const sourceFiles = [...Object.keys(dependencyBlobs), ...validationFiles].sort()
  const changedFiles = (await command(['git', 'diff', '--name-only', '--no-renames', baselineCommit, args['--candidate'], '--'])).split('\n').sort()
  assert.deepEqual(changedFiles, sourceFiles, 'temporary comparison allows only the two dependencies and reviewed validation additions')
  manifest.candidateCheckout = { commit: args['--candidate'], tree: trees.candidate }
  manifest.sourceFiles = {}
  for (const name of sourceFiles) {
    const entry = await command(['git', 'ls-tree', args['--candidate'], '--', name])
    const match = /^100644 blob ([a-f0-9]{40})\t([\s\S]+)$/.exec(entry)
    assert(match && match[2] === name, `unexpected source entry: ${name}`)
    const bytes = await fs.readFile(path.join(repo, name))
    const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
    assert.equal(blob, match[1], `checkout source differs from its commit: ${name}`)
    if (dependencyBlobs[name])
      assert.equal(blob, dependencyBlobs[name], `unexpected dependency source: ${name}`)
    manifest.sourceFiles[name] = { mode: '100644', gitBlob: blob, sha256: sha256(bytes) }
  }
  assert.equal(manifest.sourceFiles['scripts/compare-docs-css.mjs'].sha256, manifest.scriptSha256, 'running collector must match candidate source')
  manifest.workflowSha256 = manifest.sourceFiles['.github/workflows/ci.yml'].sha256
  await persist('source-binding-verified')
  manifest.pnpm = await command(['pnpm', '--version'])
  assert.equal(manifest.pnpm, '10.28.0')
  temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'b6-ui-css-'))
  manifest.temporaryRoot = temporaryRoot
  await persist('preparing-worktrees')
  for (const side of sides) {
    const commit = args[`--${side}`]
    const checkout = path.join(temporaryRoot, side)
    ownedWorktrees.push(checkout)
    await command(['git', 'worktree', 'add', '--detach', '--no-checkout', checkout, commit])
    await command(['git', 'sparse-checkout', 'set', '--no-cone', '/*', '!/.specstory/'], checkout)
    await command(['git', 'checkout', '--detach', commit], checkout)
    const entries = (await command(['git', 'ls-files', '--stage', '-z'], checkout)).split('\0').filter(Boolean).map((line) => {
      const match = /^(\d{6}) ([a-f0-9]{40}) (\d)\t([\s\S]+)$/.exec(line)
      assert(match && match[3] === '0', 'invalid or unmerged tracked entry')
      return { mode: match[1], gitBlob: match[2], name: match[4] }
    })
    const materialized = []
    const sparseExcluded = []
    for (const entry of entries) {
      try {
        await fs.lstat(path.join(checkout, entry.name))
        materialized.push(entry)
      }
      catch (error) {
        assert(error.code === 'ENOENT' && entry.name.startsWith('.specstory/'))
        sparseExcluded.push(entry)
      }
    }
    assert.equal(await command(['git', 'status', '--porcelain', '--untracked-files=no'], checkout), '', 'checkout must start clean')
    const before = await hashInputs(checkout, materialized, true)
    manifest.sides[side] = { commit, tree: trees[side], checkout, before, materialized, sparseExcluded }
    await persist(`inputs-hashed:${side}`)
    await command(['pnpm', 'install', '--frozen-lockfile'], checkout, `${side}-install`, 360000)
    assert.deepEqual(await hashInputs(checkout, materialized), before, 'install changed tracked inputs')
    await command(['pnpm', 'run', 'docs:build'], checkout, `${side}-docs-build`, 480000)
    manifest.sides[side].after = await hashInputs(checkout, materialized)
    manifest.sides[side].trackedDiffAfterBuild = await command(['git', 'diff', '--binary'], checkout)
    const dist = path.join(checkout, 'docs/dist')
    manifest.sides[side].assets = await hashFiles(dist, await filesUnder(dist))
    manifest.sides[side].dist = dist
    await persist(`built:${side}`)
  }
  const require = createRequire(path.join(repo, 'package.json'))
  const { chromium } = require('playwright')
  manifest.playwright = require('playwright/package.json').version
  browser = await chromium.launch({ headless: true })
  manifest.chromium = browser.version()
  const results = {}
  for (const side of sides) results[side] = await collect(side, await serve(manifest.sides[side].dist))
  const differences = compare(results.baseline, results.candidate, manifest.sides.baseline.assets, manifest.sides.candidate.assets)
  await write('differences.json', differences)
  manifest.result = differences.length ? 'collected-with-differences-review-required' : 'collected-no-material-difference'
  if (differences.length)
    process.exitCode = 2
}
catch (error) {
  manifest.error = String(error.stack || error)
  process.exitCode = 1
}
finally {
  // Retain source mutations and the original result before any cleanup can fail.
  for (const [side, info] of Object.entries(manifest.sides)) {
    if (!info.materialized)
      continue
    try {
      info.after = await hashInputs(info.checkout, info.materialized)
      info.trackedDiffAfterRun = await command(['git', 'diff', '--binary'], info.checkout)
    }
    catch (error) {
      info.retentionError = String(error)
      if (!manifest.error) {
        manifest.error = `failed to retain ${side} inputs: ${error}`
        manifest.result = 'collection-failed'
        process.exitCode = 1
      }
    }
  }
  manifest.finished = new Date().toISOString()
  await persist('evidence-retained-before-cleanup')
  if (browser)
    await cleanup('browser', () => browser.close())
  for (const [index, server] of servers.entries()) {
    await cleanup(`server:${index}`, () => new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
      server.closeAllConnections()
    }))
  }
  for (const [index, checkout] of [...ownedWorktrees].reverse().entries()) {
    assert(temporaryRoot && path.dirname(checkout) === temporaryRoot, 'cleanup path must belong to this invocation')
    await cleanup(`worktree:${checkout}`, () => command(['git', 'worktree', 'remove', '--force', checkout], repo, `cleanup-worktree-${index}`, 15000), 25000)
  }
  if (temporaryRoot)
    await cleanup('temporary-root', () => fs.rmdir(temporaryRoot))
  manifest.cleanupFinished = new Date().toISOString()
  await persist('finished')
  console.log(manifest.result, manifest.error || '')
}
