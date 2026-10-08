import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

type Mount = (onRequest: (page: number) => void, onConsumerEvent: (type: string) => void) => Promise<() => unknown> | (() => unknown)

export function carouselControlContracts(mount: Mount) {
  let consumerEvents = vi.fn<(type: string) => void>()
  let unmount: (() => unknown) | undefined
  afterEach(async () => {
    await unmount?.()
  })

  async function setup() {
    const onRequest = vi.fn<(page: number) => void>()
    consumerEvents = vi.fn<(type: string) => void>()
    unmount = await mount(onRequest, consumerEvents)
    await expect.element(page.getByTestId('snap-count')).toHaveTextContent('3')
    await expect.element(page.getByTestId('api-page')).toHaveTextContent('0')
    onRequest.mockClear()
    return onRequest
  }

  async function click(name: string) {
    await page.getByTestId(name).click()
  }

  async function expectPage(value: number) {
    await expect.element(page.getByTestId('api-page')).toHaveTextContent(String(value))
    await expect.element(page.getByTestId('parent-page')).toHaveTextContent(String(value))
  }

  describe('carousel controlled interaction contracts', () => {
    it('keeps repeated requests pending and follows delayed or different parent acceptance', async () => {
      const onRequest = await setup()
      await click('next')
      await click('next')
      await vi.waitFor(() => expect(onRequest.mock.calls.map(([value]) => value)).toEqual([1, 1]))
      await expectPage(0)
      await click('accept-pending')
      await expectPage(1)
      await click('next')
      await vi.waitFor(() => expect(onRequest.mock.lastCall).toEqual([2]))
      await expectPage(1)
      await click('parent-zero')
      await expectPage(0)
      await click('accept-pending')
      await expectPage(2)
      await click('previous')
      await vi.waitFor(() => expect(onRequest.mock.lastCall).toEqual([1]))
      await click('accept-pending')
      await expectPage(1)
      await click('toggle-accept')
      await click('previous')
      await expectPage(0)
      await click('next')
      await expectPage(1)
      // Observe beyond core's scroll-completion timer rather than only checking
      // the immediately rendered page after a smooth-scroll request.
      await new Promise<void>(resolve => setTimeout(resolve, 250))
      expect(onRequest.mock.calls.map(([value]) => value)).toEqual([1, 1, 2, 1, 0, 1])
      await expectPage(1)
    })

    it('honors consumer click/keyboard cancellation and read-only indicators', async () => {
      const onRequest = await setup()
      await click('toggle-cancel')
      await click('next')
      await click('indicator-two')
      await page.getByTestId('indicator-zero').click()
      await userEvent.keyboard('{ArrowRight}')
      await expectPage(0)
      expect(consumerEvents.mock.calls.map(([type]) => type)).toEqual(['click', 'click', 'click', 'keydown'])
      expect(onRequest).not.toHaveBeenCalled()
      await click('toggle-cancel')
      await click('readonly-indicator')
      expect(onRequest).not.toHaveBeenCalled()
      await click('indicator-two')
      await vi.waitFor(() => expect(onRequest).toHaveBeenCalledExactlyOnceWith(2))
      await click('accept-pending')
      await expectPage(2)
      await click('toggle-cancel')
      onRequest.mockClear()
      consumerEvents.mockClear()
      await click('previous')
      expect(consumerEvents).toHaveBeenCalledExactlyOnceWith('click')
      expect(onRequest).not.toHaveBeenCalled()
      await click('toggle-cancel')
      await click('indicator-two')
      await userEvent.keyboard('{Home}')
      await vi.waitFor(() => expect(onRequest.mock.lastCall).toEqual([0]))
      await expectPage(2)
    })

    it('honors cancellation before autoplay or mouse dragging starts', async () => {
      await setup()
      await click('toggle-cancel')
      await click('autoplay')
      await expect.element(page.getByTestId('playing')).toHaveTextContent('false')
      await click('item-group')
      await expect.element(page.getByTestId('drag-start-count')).toHaveTextContent('0')
      expect(consumerEvents.mock.calls.map(([type]) => type)).toEqual(['click', 'mousedown'])
      consumerEvents.mockClear()
      await click('toggle-cancel')
      await click('autoplay')
      await expect.element(page.getByTestId('playing')).toHaveTextContent('true')
      await click('autoplay')
      await expect.element(page.getByTestId('playing')).toHaveTextContent('false')
      await click('item-group')
      await expect.element(page.getByTestId('drag-start-count')).toHaveTextContent('1')
      expect(consumerEvents.mock.calls.map(([type]) => type)).toEqual(['click', 'click', 'mousedown'])
    })

    it('does not notify after unmounting during a scroll and can mount again', async () => {
      const onRequest = await setup()
      await click('toggle-accept')
      await click('next')
      await expectPage(1)
      await click('toggle-mounted')
      onRequest.mockClear()
      await new Promise<void>(resolve => setTimeout(resolve, 250))
      expect(onRequest).not.toHaveBeenCalled()
      await click('toggle-mounted')
      await expect.element(page.getByTestId('snap-count')).toHaveTextContent('3')
      await expectPage(1)
      await click('previous')
      await expectPage(0)
      expect(onRequest).toHaveBeenCalledExactlyOnceWith(0)
    })
  })
}
