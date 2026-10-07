import type { UseDynamicProps, UseDynamicReturn } from '../src/components/dynamic/hooks/use-dynamic'
import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, expect, it, vi } from 'vitest'
import { Dynamic, useDynamic } from '../src/components/dynamic'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

it('keeps Dynamic defaults seed-only, mutable live state and latest callbacks on the same DOM nodes', async () => {
  const first = vi.fn()
  const latest = vi.fn()
  const inputChanged = vi.fn()
  const [props, setProps] = createSignal<UseDynamicProps>({ defaultValue: ['Seed'], onValueChange: first, onInputValueChange: inputChanged })
  let api: UseDynamicReturn
  function Fixture(props: UseDynamicProps) {
    api = useDynamic(props)
    return <Dynamic.RootProvider value={api}><Dynamic.Input /><Dynamic.HiddenInput name="tags" /></Dynamic.RootProvider>
  }
  const container = document.createElement('div')
  document.body.append(container)
  const dispose = render(() => <Fixture {...props()} />, container)
  cleanups.push(() => {
    dispose()
    container.remove()
  })
  const input = container.querySelector<HTMLInputElement>('[data-part=input]')!
  const hidden = container.querySelector<HTMLInputElement>('[name=tags]')!
  expect(api!().value).toEqual(['Seed'])
  api!().addValue('Added')
  await vi.waitFor(() => expect(api!().value).toEqual(['Seed', 'Added']))
  setProps({ ...props(), defaultValue: ['Ignored'], onValueChange: latest, readOnly: true })
  await vi.waitFor(() => expect(input.disabled).toBe(true))
  expect(api!().value).toEqual(['Seed', 'Added'])
  setProps({ ...props(), value: ['Parent'], inputValue: 'Parent text', readOnly: false })
  await vi.waitFor(() => expect(api!().value).toEqual(['Parent']))
  api!().setValue(['Internal', 'Second'])
  api!().setInputValue('Draft')
  await vi.waitFor(() => expect(api!().value).toEqual(['Internal', 'Second']))
  expect(api!().inputValue).toBe('Draft')
  expect(hidden.value).toBe('["Internal","Second"]')
  expect(input.value).toBe('Draft')
  expect(first.mock.calls).toEqual([[{ value: ['Seed', 'Added'] }]])
  expect(latest.mock.calls).toEqual([[{ value: ['Internal', 'Second'] }]])
  expect(inputChanged.mock.calls).toEqual([[{ inputValue: 'Draft' }]])
  setProps({ ...props(), value: ['Later'], inputValue: 'Later text' })
  await vi.waitFor(() => expect(api!().inputValue).toBe('Later text'))
  expect(api!().value).toEqual(['Later'])
  expect(input.value).toBe('Later text')
  expect(container.querySelector('[data-part=input]')).toBe(input)
  expect(container.querySelector('[name=tags]')).toBe(hidden)
  expect(latest).toHaveBeenCalledTimes(1)
  expect(inputChanged).toHaveBeenCalledTimes(1)
})
