import assert from 'node:assert/strict'
import { Toggle } from '@destyler-ui/react'
import { createElement, createRef, version } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

// Run against the installed tarball in both React 18 and React 19, in development
// and production. No source aliases or JSX compiler can conceal ref differences.
export function verifyRefs() {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  const objectRef = createRef()
  const legacyCalls = []
  const legacyRef = (node) => {
    legacyCalls.push(node)
  }
  const legacyTree = key => createElement(Toggle.Root, { asChild: true, ref: objectRef }, createElement('button', { key, ref: legacyRef }, 'Legacy'))
  try {
    flushSync(() => root.render(legacyTree('first')))
    const first = container.querySelector('button')
    assert.ok(first)
    assert.equal(objectRef.current, first)
    assert.deepEqual(legacyCalls, [first])
    flushSync(() => root.render(legacyTree('second')))
    const second = container.querySelector('button')
    assert.notEqual(first, second)
    assert.equal(objectRef.current, second)
    assert.deepEqual(legacyCalls, [first, null, second])
    flushSync(() => root.render(null))
    assert.equal(objectRef.current, null)
    assert.deepEqual(legacyCalls, [first, null, second, null])

    if (Number.parseInt(version, 10) >= 19) {
      const calls = []
      const cleaned = []
      const cleanupRef = (node) => {
        calls.push(node)
        return () => {
          cleaned.push(node)
        }
      }
      const cleanupTree = key => createElement(Toggle.Root, { asChild: true, ref: objectRef }, createElement('button', { key, ref: cleanupRef }, 'Cleanup'))
      flushSync(() => root.render(cleanupTree('first')))
      const firstCleanupNode = container.querySelector('button')
      assert.equal(objectRef.current, firstCleanupNode)
      flushSync(() => root.render(cleanupTree('second')))
      const secondCleanupNode = container.querySelector('button')
      assert.notEqual(firstCleanupNode, secondCleanupNode)
      assert.equal(objectRef.current, secondCleanupNode)
      assert.deepEqual(cleaned, [firstCleanupNode])
      flushSync(() => root.render(null))
      assert.equal(objectRef.current, null)
      assert.deepEqual(cleaned, [firstCleanupNode, secondCleanupNode])
      assert.deepEqual(calls, [firstCleanupNode, secondCleanupNode], 'Cleanup refs must not also receive null')
    }
  }
  finally {
    root.unmount()
    container.remove()
  }
}
