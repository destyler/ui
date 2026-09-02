import { fireEvent, render, waitFor } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { Frame } from '../'

const srcdocA = '<html><head></head><body><div class="frame-root"></div></body></html>'
const srcdocB = '<html><head></head><body><main class="frame-root"></main></body></html>'

function ReactiveFrame() {
  const [srcdoc, setSrcdoc] = createSignal(srcdocA)
  const [height, setHeight] = createSignal(50)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSrcdoc(srcdocB)
          setHeight(200)
        }}
      >
        Replace document
      </button>
      <Frame
        title="Reactive preview"
        srcdoc={srcdoc()}
        head={<style id="frame-head-style">{'body { color: black; }'}</style>}
      >
        <div style={{ height: `${height()}px` }}>Frame content</div>
      </Frame>
    </>
  )
}

function ReactiveFrameContent() {
  const [content, setContent] = createSignal('Initial content')

  return (
    <>
      <button type="button" onClick={() => setContent('Updated content')}>
        Update content
      </button>
      <Frame title="Reactive content preview">{content()}</Frame>
    </>
  )
}

describe('frame', () => {
  it('requires and renders an accessible title', () => {
    render(() => <Frame title="Account preview" />)

    expect(document.querySelector('iframe')).toHaveAttribute('title', 'Account preview')
  })

  it('rebinds portals and dimension tracking after srcdoc changes', async () => {
    render(() => <ReactiveFrame />)
    const frame = document.querySelector('iframe')!

    await waitFor(() => {
      expect(frame.style.getPropertyValue('--height')).toBe('50px')
      expect(frame.contentDocument?.querySelector('#frame-head-style')).not.toBeNull()
      expect(frame.contentDocument?.querySelector('.frame-root')?.textContent).toContain('Frame content')
    })

    fireEvent.click(document.querySelector('button')!)

    await waitFor(() => {
      expect(frame.contentDocument?.querySelector('main.frame-root')?.textContent).toContain('Frame content')
      expect(frame.contentDocument?.querySelector('#frame-head-style')).not.toBeNull()
      expect(frame.style.getPropertyValue('--height')).toBe('200px')
    })
  })

  it('updates portalled children without replacing the frame document', async () => {
    render(() => <ReactiveFrameContent />)
    const frame = document.querySelector('iframe')!

    await waitFor(() => {
      expect(frame.contentDocument?.querySelector('.frame-root')).toHaveTextContent(
        'Initial content',
      )
    })

    fireEvent.click(document.querySelector('button')!)

    await waitFor(() => {
      expect(frame.contentDocument?.querySelector('.frame-root')).toHaveTextContent(
        'Updated content',
      )
    })
  })

  it('calls a callback ref once when the iframe mounts', () => {
    const ref = vi.fn()

    render(() => <Frame ref={ref} title="Ref preview" />)

    expect(ref).toHaveBeenCalledTimes(1)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLIFrameElement))
  })
})
