import type { UseCheckboxGroupProps } from '../hooks/use-checkbox-group'
import { act, StrictMode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { useCheckboxGroup } from '../hooks/use-checkbox-group'

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
const disposers: (() => void)[] = []
afterEach(async () => {
  await act(async () => disposers.splice(0).forEach(dispose => dispose()))
})
afterAll(() => vi.unstubAllGlobals())

function Probe(props: UseCheckboxGroupProps & { action: 'add' | 'toggle' | 'duplicate' | 'replace-add' | 'replace-toggle' }) {
  const group = useCheckboxGroup(props)
  return (
    <>
      <output>{JSON.stringify(group.value)}</output>
      <button
        type="button"
        onClick={() => {
          if (props.action === 'replace-toggle') {
            group.setValue(['seed'])
            group.toggleValue('seed')
            group.toggleValue('seed')
          }
          else if (props.action === 'replace-add') {
            group.setValue(['seed'])
            group.addValue('alpha')
          }
          else if (props.action === 'toggle') {
            group.toggleValue('alpha')
            group.toggleValue('alpha')
          }
          else {
            group.addValue('alpha')
            group.addValue(props.action === 'duplicate' ? 'alpha' : 'beta')
          }
        }}
      >Update group
      </button>
    </>
  )
}

function mount() {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  disposers.push(() => {
    root.unmount()
    container.remove()
  })
  return { root, container }
}

describe('checkbox group batched API requests', () => {
  it.each([
    { action: 'add', expected: ['alpha', 'beta'], requests: [['alpha'], ['alpha', 'beta']] },
    { action: 'toggle', expected: [], requests: [['alpha'], []] },
    { action: 'duplicate', expected: ['alpha'], requests: [['alpha']] },
    { action: 'replace-add', expected: ['seed', 'alpha'], requests: [['seed'], ['seed', 'alpha']] },
    { action: 'replace-toggle', expected: ['seed'], requests: [['seed'], [], ['seed']] },
  ] as const)('applies sequential uncontrolled $action operations without stale state', async ({ action, expected, requests }) => {
    const { root, container } = mount()
    const onValueChange = vi.fn()
    await act(async () => root.render(<StrictMode><Probe action={action} onValueChange={onValueChange} /></StrictMode>))
    await act(async () => container.querySelector('button')!.click())
    expect(JSON.parse(container.querySelector('output')!.textContent!)).toEqual(expected)
    expect(onValueChange.mock.calls).toEqual(requests.map(value => [value]))
  })
})

it('keeps controlled requests based on parent-owned values without optimistic accumulation', async () => {
  const { root, container } = mount()
  const onValueChange = vi.fn()
  const values: string[] = []
  Object.freeze(values)
  await act(async () => root.render(<Probe action="add" value={values} onValueChange={onValueChange} />))
  await act(async () => container.querySelector('button')!.click())
  expect(container.querySelector('output')!.textContent).toBe('[]')
  expect(onValueChange.mock.calls).toEqual([[['alpha']], [['beta']]])
  expect(values).toEqual([])

  await act(async () => root.render(<Probe action="add" value={['alpha']} onValueChange={onValueChange} />))
  expect(onValueChange).toHaveBeenCalledTimes(2)
  await act(async () => container.querySelector('button')!.click())
  expect(container.querySelector('output')!.textContent).toBe('["alpha"]')
  expect(onValueChange.mock.calls).toEqual([[['alpha']], [['beta']], [['alpha', 'beta']]])

  await act(async () => root.render(<Probe action="add" value={['alpha', 'beta']} onValueChange={onValueChange} />))
  await act(async () => container.querySelector('button')!.click())
  expect(container.querySelector('output')!.textContent).toBe('["alpha","beta"]')
  expect(onValueChange).toHaveBeenCalledTimes(3)
})

it.each(['disabled', 'readOnly'] as const)('keeps batched operations inert when %s', async (flag) => {
  const { root, container } = mount()
  const onValueChange = vi.fn()
  await act(async () => root.render(<Probe action="add" defaultValue={['seed']} {...{ [flag]: true }} onValueChange={onValueChange} />))
  await act(async () => container.querySelector('button')!.click())
  expect(container.querySelector('output')!.textContent).toBe('["seed"]')
  expect(onValueChange).not.toHaveBeenCalled()
})

it('delivers queued requests to the latest committed callback without changing pending values', async () => {
  const { root, container } = mount()
  const first = vi.fn()
  const latest = vi.fn()
  await act(async () => root.render(<Probe action="add" onValueChange={first} />))
  await act(async () => {
    container.querySelector('button')!.click()
    flushSync(() => root.render(<Probe action="add" onValueChange={latest} />))
  })
  expect(first).not.toHaveBeenCalled()
  expect(latest.mock.calls).toEqual([[['alpha']], [['alpha', 'beta']]])
  expect(container.querySelector('output')!.textContent).toBe('["alpha","beta"]')
})

it('preserves committed uncontrolled state when only the default and ordinary props change', async () => {
  const { root, container } = mount()
  const onValueChange = vi.fn()
  await act(async () => root.render(<Probe action="add" defaultValue={['seed']} onValueChange={onValueChange} />))
  await act(async () => container.querySelector('button')!.click())
  expect(container.querySelector('output')!.textContent).toBe('["seed","alpha","beta"]')
  expect(onValueChange.mock.calls).toEqual([[['seed', 'alpha']], [['seed', 'alpha', 'beta']]])

  await act(async () => root.render(<Probe action="toggle" name="updated" defaultValue={['ignored']} onValueChange={onValueChange} />))
  expect(container.querySelector('output')!.textContent).toBe('["seed","alpha","beta"]')
  expect(onValueChange).toHaveBeenCalledTimes(2)
  await act(async () => container.querySelector('button')!.click())
  expect(container.querySelector('output')!.textContent).toBe('["seed","beta","alpha"]')
  expect(onValueChange.mock.calls).toEqual([
    [['seed', 'alpha']],
    [['seed', 'alpha', 'beta']],
    [['seed', 'beta']],
    [['seed', 'beta', 'alpha']],
  ])
})
