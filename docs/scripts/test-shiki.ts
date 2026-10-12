import assert from 'node:assert/strict'
import test from 'node:test'
import { Window } from 'happy-dom'
import { highlight } from '../src/utils/shiki'

const probe = '<script data-highlight-probe>probe()</script> & <img src="x" onerror="probe()">'
const samples = {
  'vue': `<script setup lang="ts">\nconst value = ${JSON.stringify(probe)}\n</script>\n<template><p>{{ value }}</p></template>`,
  'vue-html': '<p v-if="enabled && ready">{{ value }} &amp; text</p>',
  'svelte': `<script lang="ts">\nlet value = ${JSON.stringify(probe)}\n</script>\n<p>{value}</p>`,
  'tsx': `const value: string = ${JSON.stringify(probe)}\nexport const Example = () => <p>{value}</p>`,
  'typescript': `const value: string = ${JSON.stringify(probe)}\nexport { value }`,
  'shellscript': `printf '%s\\n' '${probe}'`,
  'html': `<div title="a &amp; b">${probe}</div>`,
  'css': `p::before { content: '${probe}'; color: red; }`,
  'json': JSON.stringify({ value: probe, enabled: true }, null, 2),
}

test('the docs JavaScript engine preserves all registered snippets and both themes', async () => {
  const window = new Window({ settings: { disableJavaScriptEvaluation: true, disableJavaScriptFileLoading: true } })
  try {
    // Exercise concurrent first use of the production helper's shared initialization.
    const results = await Promise.all(Object.entries(samples).map(async ([lang, source]) => ({
      lang,
      source,
      html: await highlight(source, lang),
    })))
    for (const { lang, source, html } of results) {
      const container = window.document.createElement('div')
      container.innerHTML = html
      const code = container.querySelector('pre.shiki > code')
      assert.ok(code, `${lang}: highlighted code block`)
      assert.equal(code.textContent, source, `${lang}: preserve exact text and escaping`)
      assert.equal(container.querySelectorAll('script, img, [onerror], [data-highlight-probe]').length, 0, `${lang}: source stays text`)
      assert.ok([...code.querySelectorAll('*')].every(element => element.tagName === 'SPAN'), `${lang}: only token markup`)
      const pre = container.querySelector<HTMLElement>('pre.shiki')!
      for (const theme of ['light', 'dark']) {
        assert.ok(pre.classList.contains(`vitesse-${theme}`), `${lang}: ${theme} theme`)
        assert.ok(pre.style.getPropertyValue(`--shiki-${theme}-bg`), `${lang}: ${theme} background`)
        assert.ok(code.querySelector(`span[style*="--shiki-${theme}:"]`), `${lang}: ${theme} token colors`)
      }
      assert.equal(pre.style.color, '', `${lang}: colors remain CSS controlled`)
      assert.equal(await highlight(source, lang), html, `${lang}: repeated use remains stable`)
    }
  }
  finally {
    await window.happyDOM.close()
  }
})
