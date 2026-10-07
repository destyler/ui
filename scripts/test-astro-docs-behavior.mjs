import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { Window } from 'happy-dom'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = process.env.ASTRO_TEST_SOURCE_ROOT || root
const docsRequire = createRequire(path.join(root, 'docs/package.json'))
const astroRequire = createRequire(docsRequire.resolve('astro'))
const { parse } = astroRequire('@astrojs/compiler')

async function scripts(file) {
  const source = await fs.readFile(path.join(sourceRoot, 'docs/src/components', file), 'utf8')
  const { ast } = await parse(source)
  const result = []
  function visit(node) {
    if (node.type === 'element' && node.name === 'script') {
      const code = node.children.map(child => child.value ?? '').join('')
      result.push(ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText)
    }
    else {
      node.children?.forEach(visit)
    }
  }
  visit(ast)
  return result
}

for (const mobile of [false, true]) {
  test(`${mobile ? 'mobile' : 'desktop'} ToC keeps heading selection and idempotent current-link updates`, async () => {
    const window = new Window({ url: 'https://docs.example.test/' })
    try {
      const { document } = window
      const tag = mobile ? 'mobile-starlight-toc' : 'desktop-starlight-toc'
      document.body.innerHTML = `<header></header><main><h1 id="_top">Top</h1><article class="sl-markdown-content"><h2 id="first">First</h2><p id="paragraph">Paragraph</p><h3 id="second">Second</h3><h2 id="unlisted">Unlisted</h2></article></main>
        <${tag} data-min-h="2" data-max-h="3"><details><summary tabindex="0">Contents<span class="toc-display-current"></span></summary><nav><a href="#_top">Top</a><a href="#first">First</a><a href="#second">Second</a></nav></details></${tag}><button id="outside">Outside</button>`
      document.querySelector('header').getBoundingClientRect = () => ({ height: 50 })
      document.querySelector('summary').getBoundingClientRect = () => ({ height: 20 })
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000 })
      const idle = []
      window.requestIdleCallback = (callback) => {
        idle.push(callback)
        return idle.length
      }
      const observers = []
      window.IntersectionObserver = class {
        targets = []
        constructor(callback, options) {
          this.callback = callback
          this.options = options
          observers.push(this)
        }

        observe(target) { this.targets.push(target) }
        disconnect() {}
      }
      const [code] = await scripts(mobile ? 'MobileTableOfContents.astro' : 'TableOfContents.astro')
      window.eval(code)
      assert.equal(idle.length, 1)
      idle.shift()()
      assert.equal(observers.length, 1)
      const observer = observers[0]
      assert.equal(observer.options.rootMargin, mobile ? '-102px 0% -845px' : '-82px 0% -865px')
      assert.ok(observer.targets.includes(document.getElementById('first')))
      const toc = document.querySelector(tag)
      const links = [...toc.querySelectorAll('a')]
      const prototype = Object.getPrototypeOf(toc)
      const command = Object.getOwnPropertyDescriptor(prototype, 'setCurrentLink') ?? Object.getOwnPropertyDescriptor(prototype, 'current')
      assert.equal(command.enumerable, false)
      assert.equal(command.configurable, true)
      assert.equal(typeof (command.value ?? command.set), 'function')
      const writes = []
      for (const link of links) {
        const setAttribute = link.setAttribute.bind(link)
        link.setAttribute = (name, value) => {
          writes.push([link.hash, name, value])
          setAttribute(name, value)
        }
      }
      const report = (...entries) => observer.callback(entries.map(([id, isIntersecting = true]) => ({ target: document.getElementById(id), isIntersecting })))
      report(['first', false])
      assert.equal(toc.querySelectorAll('[aria-current]').length, 0)
      report(['first'])
      assert.equal(links[1].getAttribute('aria-current'), 'true')
      assert.equal(toc.querySelectorAll('[aria-current]').length, 1)
      if (mobile)
        assert.equal(toc.querySelector('.toc-display-current').textContent, 'First')
      const count = writes.length
      report(['first'])
      assert.equal(writes.length, count)
      report(['second'], ['first'])
      assert.equal(links[2].getAttribute('aria-current'), 'true')
      assert.equal(links[1].hasAttribute('aria-current'), false)
      report(['paragraph'])
      assert.equal(links[1].getAttribute('aria-current'), 'true')
      report(['unlisted'], ['second'])
      assert.equal(links[2].getAttribute('aria-current'), 'true')
      assert.equal(toc.querySelectorAll('[aria-current]').length, 1)
      if (mobile) {
        assert.equal(toc.querySelector('.toc-display-current').textContent, 'Second')
        // Constructor-time close/focus handlers are checked in native Chromium.
      }
    }
    finally {
      await window.happyDOM.close()
    }
  })
}

for (const mode of ['matching', 'different-hash', 'mobile']) {
  test(`Sidebar indexed restore and persistence preserve ${mode} state`, async () => {
    const window = new Window({ url: 'https://docs.example.test/' })
    try {
      const { document } = window
      document.body.innerHTML = `<div id="starlight__sidebar"></div><sl-sidebar-state-persist data-hash="current"><details><sl-sidebar-restore data-index="0"></sl-sidebar-restore></details><details open><sl-sidebar-restore data-index="1suffix"></sl-sidebar-restore></details><details><sl-sidebar-restore data-index="invalid"></sl-sidebar-restore></details></sl-sidebar-state-persist>`
      const state = { hash: mode === 'different-hash' ? 'old' : 'current', scroll: 120, open: { 0: true, 1: false } }
      window.sessionStorage.setItem('sl-sidebar-state', JSON.stringify(state))
      window.matchMedia = () => ({ matches: mode !== 'mobile' })
      const [restore, scroll, save] = await scripts('Sidebar.astro')
      // Compare the explicit intrinsic to the legacy global by identity.
      assert.equal(Number.parseInt, Reflect.get(globalThis, 'parseInt'))
      window.eval(restore)
      window.eval(scroll)
      const details = [...document.querySelectorAll('details')]
      assert.deepEqual(details.map(node => node.open), mode === 'matching' ? [true, false, false] : [false, true, false])
      assert.equal(document.getElementById('starlight__sidebar').scrollTop, mode === 'matching' ? 120 : 0)
      window.eval(save)
      document.getElementById('starlight__sidebar').scrollTop = 75
      details[2].open = true
      document.dispatchEvent(new window.Event('astro:before-preparation'))
      assert.deepEqual(JSON.parse(window.sessionStorage.getItem('sl-sidebar-state')), {
        hash: 'current',
        scroll: 75,
        open: { 0: details[0].open, 1: details[1].open, 2: true },
      })
      details[0].open = false
      window.dispatchEvent(new window.Event('beforeunload'))
      assert.equal(JSON.parse(window.sessionStorage.getItem('sl-sidebar-state')).open[0], false)
    }
    finally {
      await window.happyDOM.close()
    }
  })
}

test('the explicit Node process import has the same cwd owner as the existing global', () => {
  const existingGlobal = Reflect.get(globalThis, 'process')
  assert.equal(process === existingGlobal, true)
  assert.equal(process.cwd(), existingGlobal.cwd())
})
