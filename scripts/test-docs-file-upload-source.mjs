import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright/test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const { frameworks } = require('../docs/src/config/frameworks.ts')
const { getExampleSourcePath, rewriteExampleSourceImports } = require('../docs/src/utils/example-source.ts')

const framework = frameworks.find(framework => framework.id === 'vue')
const sourcePath = getExampleSourcePath(root, framework, 'file-upload', 'Basic')
const source = rewriteExampleSourceImports(await readFile(sourcePath, 'utf8'), framework, sourcePath)
const dist = process.env.DOCS_DIST || path.join(root, 'docs/dist')
const html = await readFile(path.join(dist, 'components/file-upload/index.html'), 'utf8')
const browser = await chromium.launch()

try {
  // Check native HTML parsing of the exact repository example, including its
  // escaped HTML comment. Hydration is outside this source-text regression.
  const page = await browser.newPage({ javaScriptEnabled: false })
  await page.setContent(html, { waitUntil: 'domcontentloaded' })
  const code = page.locator('.ds-component-preview:has(.ds-preview-frame.file-upload-basic) .ds-code-block[data-fw="vue"] pre.shiki > code')
  // The route renders Basic in both the introduction and the Basic examples section.
  assert.equal(await code.count(), 2, 'locate both built Basic Vue file-upload snippets')
  for (const block of await code.all()) {
    assert.equal(await block.textContent(), source, 'native DOM preserves the complete file-upload source')
  }
  console.log(JSON.stringify({ route: '/components/file-upload/', example: 'Basic', framework: 'vue', exactText: true }))

  // Missing-example HTML comments contain '<', so markup presence alone cannot
  // prove that ComponentPreview resolved the original source after bundling.
  const checkboxHtml = await readFile(path.join(dist, 'components/checkbox/index.html'), 'utf8')
  await page.setContent(checkboxHtml, { waitUntil: 'domcontentloaded' })
  for (const framework of frameworks) {
    const sourcePath = getExampleSourcePath(root, framework, 'checkbox', 'Basic')
    const source = rewriteExampleSourceImports(await readFile(sourcePath, 'utf8'), framework, sourcePath)
    const code = page.locator(`.ds-component-preview:has(.ds-preview-frame.checkbox-basic) .ds-code-block[data-fw="${framework.id}"] pre.shiki > code`)
    assert.equal(await code.count(), 2, `locate both built Basic ${framework.label} checkbox snippets`)
    for (const block of await code.all()) {
      assert.equal(await block.textContent(), source, `native DOM preserves the complete ${framework.label} checkbox source`)
    }
    console.log(JSON.stringify({ route: '/components/checkbox/', example: 'Basic', framework: framework.id, exactText: true }))
  }
}
finally {
  await browser.close()
}
