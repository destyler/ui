import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Progress, progressAnatomy } from '../'
import { expectExport, getExports, getParts } from '../../../setup-test'
import { ComponentUnderTest } from './basic'

describe('progress', () => {
  it.each(getParts(progressAnatomy))('should render part! %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(progressAnatomy))('should export %s', async (part) => {
    expectExport(Progress, part)
  })

  it('should handle value', async () => {
    render(() => <ComponentUnderTest value={7} />)

    screen.getByText('7%')
  })

  it('seeds defaultValue when live value is omitted', async () => {
    render(() => <ComponentUnderTest defaultValue={70} />)

    screen.getByText('70%')
  })

  it('omits undefined live value so defaultValue seeds the machine', async () => {
    render(() => <ComponentUnderTest defaultValue={55} value={undefined} />)

    screen.getByText('55%')
  })

  it('should handle custom max range', async () => {
    render(() => <ComponentUnderTest value={30} max={30} />)

    screen.getByText('100%')
  })

  it('updates UI when parent controlled value changes', async () => {
    const [value, setValue] = createSignal<number | null>(42)
    render(() => (
      <>
        <button type="button" onClick={() => setValue(80)}>parent-set-80</button>
        <ComponentUnderTest value={value()} onValueChange={e => setValue(e.value)} />
      </>
    ))
    screen.getByText('42%')
    await user.click(screen.getByRole('button', { name: 'parent-set-80' }))
    await waitFor(() => screen.getByText('80%'))
  })

  it('writes parent state back through onValueChange when api.setValue runs', async () => {
    const onValueChange = vi.fn()
    const [value, setValue] = createSignal<number | null>(42)
    render(() => (
      <Progress.Root
        value={value()}
        onValueChange={(details) => {
          onValueChange(details)
          setValue(details.value)
        }}
      >
        <Progress.Label>Label</Progress.Label>
        <Progress.ValueText />
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
        <Progress.Context>
          {api => (
            <button type="button" onClick={() => api().setValue(65)}>
              api-set-65
            </button>
          )}
        </Progress.Context>
      </Progress.Root>
    ))
    screen.getByText('42%')
    await user.click(screen.getByRole('button', { name: 'api-set-65' }))
    await waitFor(() => expect(onValueChange).toHaveBeenCalled())
    await waitFor(() => screen.getByText('65%'))
  })
})
