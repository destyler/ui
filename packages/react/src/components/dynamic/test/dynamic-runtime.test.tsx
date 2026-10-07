import type { UseDynamicProps, UseDynamicReturn } from '../hooks/use-dynamic'
import { act, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Dynamic, useDynamic } from '../index'

vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  for (const cleanup of cleanups.splice(0))
    await cleanup()
})

async function setup(props: UseDynamicProps) {
  let api: UseDynamicReturn
  const inputRef = createRef<HTMLInputElement>()
  const hiddenRef = createRef<HTMLInputElement>()
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  function Fixture(props: UseDynamicProps) {
    api = useDynamic({ id: 'runtime-tags', ...props })
    return (
      <Dynamic.RootProvider value={api}>
        <Dynamic.Input ref={inputRef} />
        <Dynamic.HiddenInput ref={hiddenRef} name="tags" />
        <output>{JSON.stringify(api.value)}</output>
      </Dynamic.RootProvider>
    )
  }
  async function rerender(next: UseDynamicProps) {
    await act(async () => root.render(<Fixture {...next} />))
  }
  await rerender(props)
  cleanups.push(async () => {
    await act(async () => root.unmount())
    expect(inputRef.current).toBeNull()
    expect(hiddenRef.current).toBeNull()
    container.remove()
  })
  return { api: () => api!, inputRef, hiddenRef, container, rerender }
}

describe('dynamic mutable synchronization contract', () => {
  it('keeps a changed default as a seed only and uses the latest callback', async () => {
    const oldCallback = vi.fn()
    const newCallback = vi.fn()
    const fixture = await setup({ defaultValue: ['Seed'], onValueChange: oldCallback })
    await act(async () => fixture.api().addValue('Added'))
    expect(fixture.api().value).toEqual(['Seed', 'Added'])
    await fixture.rerender({ defaultValue: ['Ignored'], onValueChange: newCallback, readOnly: true })
    expect(fixture.api().value).toEqual(['Seed', 'Added'])
    expect(fixture.inputRef.current?.disabled).toBe(true)
    await act(async () => fixture.api().setValue(['Programmatic']))
    expect(oldCallback.mock.calls).toEqual([[{ value: ['Seed', 'Added'] }]])
    expect(newCallback.mock.calls).toEqual([[{ value: ['Programmatic'] }]])
    expect(fixture.api().value).toEqual(['Programmatic'])
  })
})
