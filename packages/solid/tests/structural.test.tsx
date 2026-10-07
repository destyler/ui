import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import { AspectRatio } from '../src/components/aspect-ratio'
import { Label } from '../src/components/label'
import { Separator } from '../src/components/separator'

const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

describe('structural rendered contracts', () => {
  it('updates ratio and orientation while retaining nodes and composed label refs', async () => {
    const host = document.createElement('main')
    document.body.append(host)
    const [ratio, setRatio] = createSignal(2)
    const [vertical, setVertical] = createSignal(false)
    let parentRef: HTMLLabelElement | undefined
    let childRef: HTMLLabelElement | undefined
    const dispose = render(() => (
      <>
        <AspectRatio.Root id="frame" ratio={ratio()}><AspectRatio.Content id="caller-content">Media</AspectRatio.Content></AspectRatio.Root>
        <Separator.Root orientation={vertical() ? 'vertical' : 'horizontal'} />
        <Label.Root for="field" ref={node => parentRef = node} asChild={props => <label {...props({ id: 'caller-label', ref: node => childRef = node })}>Name</label>} />
        <input id="field" />
      </>
    ), host)
    cleanups.push(() => {
      dispose()
      host.remove()
    })
    const frame = host.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="root"]')!
    const separator = host.querySelector('[role="separator"]')!
    expect(frame.style.paddingBottom).toBe('50%')
    expect(parentRef).toBe(childRef)
    expect(parentRef).toBe(host.querySelector('label'))
    expect(parentRef?.htmlFor).toBe('field')
    expect(parentRef?.id).toBe('caller-label')
    setRatio(0.5)
    setVertical(true)
    await expect.poll(() => frame.style.paddingBottom).toBe('200%')
    expect(host.querySelector('[data-scope="aspect-ratio"][data-part="root"]')).toBe(frame)
    expect(host.querySelector('#caller-content')?.parentElement).toBe(frame)
    expect(separator.getAttribute('aria-orientation')).toBe('vertical')
  })
})
