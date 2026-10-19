import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = process.env.DOCS_DIST || path.join(root, 'docs/dist')
const site = 'https://ui.destyler.org'

function assertSiteUrl(value) {
  const url = new URL(value)
  assert.equal(url.origin, site, `Unexpected documentation origin: ${value}`)
  assert.equal(url.username + url.password + url.search + url.hash, '', `Unexpected URL metadata: ${value}`)
  return url
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)]
    .map(([, name, , value]) => [name, value]))
}

function assertPageOrigin(html) {
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag))
  const metadata = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag))
  const canonical = links.filter(link => link.rel === 'canonical')
  const openGraph = metadata.filter(meta => meta.property === 'og:url')
  assert.equal(canonical.length, 1, 'Each page must have exactly one canonical URL')
  assert.equal(openGraph.length, 1, 'Each page must have exactly one Open Graph URL')
  assertSiteUrl(canonical[0].href)
  assertSiteUrl(openGraph[0].content)
  assert.equal(openGraph[0].content, canonical[0].href)
  return canonical[0].href
}

function sitemapUrls(xml) {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url)
  assert.ok(urls.length > 0, 'Sitemaps must contain URLs')
  for (const url of urls)
    assertSiteUrl(url)
  return urls
}

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : []
  })
}

test('origin checks reject obsolete, preview, relative and misleading URLs', () => {
  for (const url of [
    'https://ui.destyler.dev/',
    'https://destyler-ui-dev.vercel.app/',
    'http://ui.destyler.org/',
    'https://ui.destyler.org.example.com/',
    'https://ui.destyler.org@other.example/',
    'https://user@ui.destyler.org/',
    '/components/checkbox/',
    `${site}/?preview=1`,
  ]) {
    assert.throws(() => assertSiteUrl(url), undefined, url)
  }
  assert.equal(assertSiteUrl(`${site}/components/checkbox/`).pathname, '/components/checkbox/')
})

test('page checks reject missing, duplicate and mismatched metadata', () => {
  const canonical = `<link rel="canonical" href="${site}/">`
  const openGraph = `<meta property="og:url" content="${site}/">`
  assert.equal(assertPageOrigin(canonical + openGraph), `${site}/`)
  assert.throws(() => assertPageOrigin(openGraph))
  assert.throws(() => assertPageOrigin(canonical))
  assert.throws(() => assertPageOrigin(canonical + canonical + openGraph))
  assert.throws(() => assertPageOrigin(canonical + openGraph.replace(`${site}/`, `${site}/other/`)))
  assert.throws(() => assertPageOrigin((canonical + openGraph).replaceAll(site, 'https://ui.destyler.dev')))
})

test('sitemap checks reject empty or mixed-origin entries', () => {
  assert.throws(() => sitemapUrls('<urlset/>'))
  assert.throws(() => sitemapUrls(`<loc>${site}/</loc><loc>https://ui.destyler.dev/</loc>`))
  assert.deepEqual(sitemapUrls(`<loc>${site}/</loc>`), [`${site}/`])
})

test('every built documentation page emits the official canonical and Open Graph origin', () => {
  const files = htmlFiles(dist)
  assert.ok(files.length > 0, 'Build documentation before running this check')
  for (const file of files)
    assertPageOrigin(fs.readFileSync(file, 'utf8'))
  for (const route of ['', 'components/checkbox/', 'overview/getting-started/']) {
    const html = fs.readFileSync(path.join(dist, route, 'index.html'), 'utf8')
    assert.equal(assertPageOrigin(html), `${site}/${route}`)
  }
  console.log(`Verified canonical and Open Graph origins on ${files.length} built pages`)
})

test('built sitemap index and every referenced sitemap use the official origin', () => {
  const index = fs.readFileSync(path.join(dist, 'sitemap-index.xml'), 'utf8')
  const pages = []
  for (const location of sitemapUrls(index)) {
    const pathname = assertSiteUrl(location).pathname
    assert.match(pathname, /^\/sitemap-[\w-]+\.xml$/, 'Expected a local generated sitemap')
    pages.push(...sitemapUrls(fs.readFileSync(path.join(dist, pathname.slice(1)), 'utf8')))
  }
  assert.equal(new Set(pages).size, pages.length, 'Sitemap page URLs must be unique')
  for (const route of ['', 'components/checkbox/', 'overview/getting-started/'])
    assert.ok(pages.includes(`${site}/${route}`), `Missing sitemap page: ${route || '/'}`)
  console.log(`Verified ${pages.length} sitemap page URLs`)
})
