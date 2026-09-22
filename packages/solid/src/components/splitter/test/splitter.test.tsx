import { render } from '@solidjs/testing-library'
import { Splitter, splitterAnatomy } from '../'
import { expectExport, getExports, getParts } from '../../../setup-test'
import { InitialSize } from '../examples/InitialSize'
import { ComponentUnderTest } from './basic'

describe('splitter', () => {
  it.each(getParts(splitterAnatomy))('should render part! %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(splitterAnatomy))('should export %s', async (part) => {
    expectExport(Splitter, part)
  })

  it('seeds default* via InitialSize example', async () => {
    render(() => <InitialSize />)
    const panels = document.querySelectorAll('[data-scope="splitter"][data-part="panel"]')
    expect(panels.length).toBeGreaterThanOrEqual(2)
    const sizes = Array.from(panels).map(p => p.getAttribute('data-size') || (p as HTMLElement).style.flex || (p as HTMLElement).style.width)
    expect(sizes.join(' ')).toMatch(/30|70/)
  })
})
