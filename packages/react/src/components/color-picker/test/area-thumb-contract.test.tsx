import type { ComponentProps } from 'react'
import { connect, machine } from '@destyler/color-picker'
import { normalizeProps } from '@destyler/react'
import { act, createRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ColorPicker, parseColor } from '../index'

const mounted: Array<{ root: ReturnType<typeof createRoot>, service?: ReturnType<typeof machine>, container: HTMLElement }> = []

beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))

afterEach(async () => {
  for (const { root, service, container } of mounted.splice(0)) {
    service?.stop()
    await act(() => root.unmount())
    container.remove()
  }
  vi.unstubAllGlobals()
})

async function setup(
  thumbProps: ComponentProps<typeof ColorPicker.AreaThumb> = {},
  context: Partial<Parameters<typeof machine>[0]> = {},
  areaProps: ComponentProps<typeof ColorPicker.Area> = {},
) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const service = machine({ id: `area-thumb-${mounted.length}`, defaultOpen: true, defaultValue: parseColor('#FF0000'), ...context })
  service.start()
  const api = connect(service.state, service.send, normalizeProps)
  const root = createRoot(container)
  mounted.push({ root, service, container })
  await act(() => root.render(
    <ColorPicker.RootProvider value={api}>
      <ColorPicker.Control><ColorPicker.Trigger /></ColorPicker.Control>
      <ColorPicker.Positioner>
        <ColorPicker.Content>
          <ColorPicker.Area {...areaProps}>
            <ColorPicker.AreaThumb {...thumbProps} />
          </ColorPicker.Area>
        </ColorPicker.Content>
      </ColorPicker.Positioner>
    </ColorPicker.RootProvider>,
  ))
  const thumb = container.querySelector<HTMLElement>('[data-part="area-thumb"]')!
  const press = async (key: string, options: KeyboardEventInit = {}) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options })
    await act(() => {
      thumb.dispatchEvent(event)
    })
    return event
  }
  return { thumb, service, press }
}

describe('color-picker AreaThumb prop composition', () => {
  it('calls the consumer first while retaining keyboard editing, event options, styles, and ref', async () => {
    const calls: string[] = []
    // eslint-disable-next-line react/no-create-ref -- This external renderer harness owns the ref outside a React component.
    const ref = createRef<HTMLDivElement>()
    let target: EventTarget | null = null
    const onKeyDown = vi.fn((event) => {
      calls.push(`consumer:${event.key}:${event.shiftKey}`)
      target = event.currentTarget
    })
    const { thumb, service, press } = await setup({
      ref,
      onKeyDown,
      className: 'custom-thumb',
      style: { outlineWidth: '1px' },
    }, {
      onValueChange: ({ valueAsString }) => calls.push(`change:${valueAsString}`),
    })

    expect(ref.current).toBe(thumb)
    expect(thumb.className).toBe('custom-thumb')
    expect(thumb.style.outlineWidth).toBe('1px')
    expect(thumb.style.position).toBe('absolute')
    expect(thumb.style.left).toBe('100%')
    const event = await press('ArrowLeft', { shiftKey: true })
    expect(target).toBe(thumb)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
    expect(service.state.context.value?.toFormat('hsba').getChannelValue('saturation')).toBe(90)
    expect(calls).toEqual(['consumer:ArrowLeft:true', 'change:rgba(255, 25, 25, 1)'])
  })

  it('preserves consumer cancellation and disabled/read-only guards', async () => {
    for (const context of [{}, { disabled: true }, { readOnly: true }]) {
      const onValueChange = vi.fn()
      const onKeyDown = vi.fn((event) => {
        if (!context.disabled && !context.readOnly)
          event.preventDefault()
      })
      const { service, press } = await setup({ onKeyDown }, { ...context, onValueChange })
      await press('ArrowLeft')
      expect(onKeyDown).toHaveBeenCalledTimes(1)
      expect(service.state.context.value?.toString('hex')).toBe('#FF0000')
      expect(onValueChange).not.toHaveBeenCalled()
    }
  })

  it('retains custom area axes and asChild event cancellation', async () => {
    const onValueChange = vi.fn()
    const onKeyDown = vi.fn()
    const { service, press } = await setup({ onKeyDown }, { onValueChange }, { xChannel: 'hue', yChannel: 'brightness' })
    await press('ArrowRight')
    expect(service.state.context.value?.toFormat('hsba').getChannelValue('hue')).toBe(1)
    expect(onValueChange).toHaveBeenCalledTimes(1)

    const childHandler = vi.fn(event => event.preventDefault())
    const parentHandler = vi.fn()
    const vetoed = await setup({
      asChild: true,
      onKeyDown: parentHandler,
      children: <div onKeyDown={childHandler} />,
    }, { onValueChange })
    await vetoed.press('ArrowLeft')
    expect(childHandler).toHaveBeenCalledTimes(1)
    expect(parentHandler).toHaveBeenCalledTimes(1)
    expect(vetoed.service.state.context.value?.toString('hex')).toBe('#FF0000')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })
})

async function setupRoot(controlled: boolean) {
  const calls: string[] = []
  let proposed: ReturnType<typeof parseColor> | undefined
  let accept = () => {}
  let acceptImmediately = false

  function Harness() {
    const [value, setValue] = useState(() => parseColor('#FF0000'))
    accept = () => {
      if (proposed)
        setValue(proposed)
    }
    return (
      <ColorPicker.Root
        id="area-thumb-root"
        defaultOpen
        openAutoFocus={false}
        format="hsba"
        {...(controlled ? { value } : { defaultValue: parseColor('#FF0000') })}
        onValueChange={({ value, valueAsString }) => {
          calls.push(`change:${valueAsString}`)
          proposed = value
          if (acceptImmediately)
            setValue(value)
        }}
        onValueChangeEnd={() => calls.push('end')}
        onFormatChange={() => calls.push('format')}
      >
        <ColorPicker.Control><ColorPicker.Trigger /></ColorPicker.Control>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area>
              <ColorPicker.AreaThumb onKeyDown={event => calls.push(`consumer:${event.key}`)} />
            </ColorPicker.Area>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </ColorPicker.Root>
    )
  }

  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  mounted.push({ root, container })
  await act(async () => {
    root.render(<Harness />)
    await Promise.resolve()
  })
  const thumb = () => container.querySelector<HTMLElement>('[data-part="area-thumb"]')!
  const press = async (key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    await act(async () => {
      thumb().dispatchEvent(event)
      // The public value callback is queued by useEvent; flush parent updates too.
      await Promise.resolve()
    })
    return event
  }
  return {
    calls,
    thumb,
    press,
    accept: async () => {
      await act(async () => {
        accept()
        await Promise.resolve()
      })
    },
    acceptInCallback: () => {
      acceptImmediately = true
    },
  }
}

describe('color-picker AreaThumb real Root reconciliation', () => {
  it('updates the uncontrolled rendered position exactly once on consecutive keys', async () => {
    const { calls, thumb, press } = await setupRoot(false)
    expect(thumb().style.left).toBe('100%')
    expect((await press('ArrowLeft')).defaultPrevented).toBe(true)
    expect(thumb().style.left).toBe('99%')
    expect((await press('ArrowLeft')).defaultPrevented).toBe(true)
    expect(thumb().style.left).toBe('98%')
    expect(calls).toEqual([
      'consumer:ArrowLeft',
      'change:hsba(0, 99%, 100%, 1)',
      'consumer:ArrowLeft',
      'change:hsba(0, 98%, 100%, 1)',
    ])
  })

  it('retains controlled ownership through veto, delayed acceptance and immediate parent-callback acceptance', async () => {
    const { calls, thumb, press, accept, acceptInCallback } = await setupRoot(true)
    expect(thumb().style.left).toBe('100%')
    await press('ArrowLeft')
    expect(thumb().style.left).toBe('100%')
    await press('ArrowLeft')
    expect(thumb().style.left).toBe('100%')
    expect(calls).toEqual([
      'consumer:ArrowLeft',
      'change:hsba(0, 99%, 100%, 1)',
      'consumer:ArrowLeft',
      'change:hsba(0, 99%, 100%, 1)',
    ])

    await accept()
    expect(thumb().style.left).toBe('99%')
    expect(calls).toHaveLength(4)

    acceptInCallback()
    await press('ArrowLeft')
    expect(thumb().style.left).toBe('98%')
    await press('ArrowLeft')
    expect(thumb().style.left).toBe('97%')
    expect(calls).toEqual([
      'consumer:ArrowLeft',
      'change:hsba(0, 99%, 100%, 1)',
      'consumer:ArrowLeft',
      'change:hsba(0, 99%, 100%, 1)',
      'consumer:ArrowLeft',
      'change:hsba(0, 98%, 100%, 1)',
      'consumer:ArrowLeft',
      'change:hsba(0, 97%, 100%, 1)',
    ])
  })
})
