import { cleanup, render } from '@solidjs/testing-library'
import { onCleanup } from 'solid-js'
import { Portal } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import { browserSmoke } from '../../../../utils/test/browser-smoke/suite'
import { Basic as CheckboxExample } from '../components/checkbox/examples/Basic'
import { ComponentUnderTest as DialogExample } from '../components/dialog/test/basic'
import { Basic as TreeExample } from '../components/tree/examples/Basic'

// Vitest browser projects do not enable globals, so register disposal explicitly.
afterEach(cleanup)

describe('Solid smoke renderer lifecycle', { concurrent: false, shuffle: false }, () => {
  let disposals = 0
  let container: HTMLElement

  function LifecycleFixture() {
    onCleanup(() => disposals++)
    return (
      <>
        <span data-cleanup-sentinel="rendered">Rendered sentinel</span>
        <Portal><span data-cleanup-sentinel="portal">Portal sentinel</span></Portal>
      </>
    )
  }

  it('mounts a tracked Solid root and body portal', () => {
    ({ container } = render(() => <LifecycleFixture />))
    expect(container.isConnected).toBe(true)
    expect(document.querySelectorAll('[data-cleanup-sentinel]')).toHaveLength(2)
    expect(disposals).toBe(0)
  })

  it('disposes the root and removes its DOM before the next render', () => {
    expect(disposals).toBe(1)
    expect(container.isConnected).toBe(false)
    expect(document.querySelectorAll('[data-cleanup-sentinel]')).toHaveLength(0)
    render(() => <LifecycleFixture />)
    expect(document.querySelectorAll('[data-cleanup-sentinel]')).toHaveLength(2)
  })
})

browserSmoke({
  checkbox: () => render(() => <CheckboxExample />),
  dialog: () => render(() => <DialogExample />),
  tree: () => render(() => <TreeExample />),
})
