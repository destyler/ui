import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TreeStage2NodeContextFixture } from './tree-stage2-node-context-fixture'

describe('tree.NodeContext SSR', () => {
  it.each([false, true])('renders nested custom node state without browser globals (RootProvider=%s)', async (rootProvider) => {
    expect(typeof document).toBe('undefined')
    const html = renderToString(<TreeStage2NodeContextFixture rootProvider={rootProvider} />)
    const outputs = Object.fromEntries([...html.matchAll(/<output data-node-state="([^"]+)"[^>]*>(.*?)<\/output>/g)]
      .map(([, name, content]) => [name, JSON.parse(content.replaceAll('&quot;', '"').replaceAll('<!-- -->', ''))]))
    expect(outputs['outer-before']).toEqual({
      value: 'branch',
      valuePath: ['branch'],
      disabled: false,
      selected: false,
      focused: false,
      depth: 1,
      expanded: false,
      isBranch: true,
    })
    expect(outputs['outer-after']).toEqual(outputs['outer-before'])
    expect(outputs.inner).toEqual({
      value: 'leaf',
      valuePath: ['branch', 'leaf'],
      disabled: false,
      selected: true,
      focused: true,
      depth: 2,
      expanded: false,
      isBranch: false,
    })
    expect(outputs.sibling).toEqual({
      value: 'other',
      valuePath: ['other'],
      disabled: true,
      selected: false,
      focused: false,
      depth: 1,
      expanded: false,
      isBranch: true,
    })
    expect(typeof document).toBe('undefined')
  })
})
