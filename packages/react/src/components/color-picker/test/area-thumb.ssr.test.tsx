import { renderToString } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { ColorPicker, parseColor } from '../index'

it('renders the real Root AreaThumb with merged core and consumer props without browser globals', () => {
  expect(typeof window).toBe('undefined')
  expect(typeof document).toBe('undefined')
  const onKeyDown = vi.fn()
  const html = renderToString(
    <ColorPicker.Root id="area-thumb-ssr" defaultOpen defaultValue={parseColor('#FF0000')}>
      <ColorPicker.Area>
        <ColorPicker.AreaThumb className="consumer-thumb" style={{ outlineWidth: '1px' }} onKeyDown={onKeyDown} />
      </ColorPicker.Area>
    </ColorPicker.Root>,
  )
  const thumb = html.match(/<div[^>]*data-part="area-thumb"[^>]*>/)?.[0]
  expect(thumb).toBeDefined()
  expect(thumb).toContain('id="color-picker:area-thumb-ssr:area-thumb"')
  expect(thumb).toContain('role="slider"')
  expect(thumb).toContain('position:absolute')
  expect(thumb).toContain('left:100%')
  expect(thumb).toContain('outline-width:1px')
  expect(thumb).toContain('class="consumer-thumb"')
  expect(html).not.toMatch(/onkeydown/i)
  expect(onKeyDown).not.toHaveBeenCalled()
  expect(typeof window).toBe('undefined')
  expect(typeof document).toBe('undefined')
})
