import { render, screen } from '@solidjs/testing-library'
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
})
