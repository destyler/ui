import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Timer, timerAnatomy } from '../index'

// Parts that exist in anatomy but don't have corresponding API methods
const skippedParts = ['item-value', 'item-label']
const skippedExports = ['ItemValue', 'ItemLabel']

describe('[timer] component', () => {
  const parts = getParts(timerAnatomy).filter(
    part => !skippedParts.some(skip => part.includes(skip)),
  )

  it.each(parts)('should render part %s', async (part) => {
    await render(<Basic />)
    await vi.waitFor(() => {
      expect(document.querySelector(part)).toBeInTheDocument()
    })
  })

  const exports = getExports(timerAnatomy).filter(
    exp => !skippedExports.includes(exp),
  )

  it.each(exports)('should export %s', async (part) => {
    expect(Timer).toHaveProperty(part, expect.anything())
  })
})

describe('[timer] action controls', () => {
  it('supports repeated controls without leaking action or submitting a form', async () => {
    const onSubmit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) => event.preventDefault())
    const screen = await render(
      <form onSubmit={onSubmit}>
        <Timer.Root startMs={60000} countdown interval={25}>
          <Timer.Context>{api => <output data-running={String(api.running)} data-paused={String(api.paused)} data-time-ms={((api.time.days * 24 + api.time.hours) * 60 + api.time.minutes) * 60000 + api.time.seconds * 1000 + api.time.milliseconds} />}</Timer.Context>
          {(['start', 'pause', 'resume', 'reset'] as const).map(action => <Timer.ActionTrigger key={action} action={action}>{action}</Timer.ActionTrigger>)}
        </Timer.Root>
      </form>,
    )
    const time = () => Number(document.querySelector('output')?.getAttribute('data-time-ms'))
    expect(time()).toBe(60000)
    for (let cycle = 0; cycle < 2; cycle++) {
      for (const [action, running, paused] of [['start', true, false], ['pause', false, true], ['resume', true, false], ['pause', false, true], ['reset', false, false]] as const) {
        const trigger = screen.getByRole('button', { name: action, exact: true })
        await expect.element(trigger).toHaveAttribute('type', 'button')
        await expect.element(trigger).not.toHaveAttribute('action')
        await trigger.click()
        await vi.waitFor(() => {
          expect(document.querySelector('output')?.getAttribute('data-running')).toBe(String(running))
          expect(document.querySelector('output')?.getAttribute('data-paused')).toBe(String(paused))
        })
        if (action === 'start')
          await vi.waitFor(() => expect(time()).toBeLessThan(60000))
        if (action === 'reset')
          expect(time()).toBe(60000)
      }
    }
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
