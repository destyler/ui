import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { carouselControlContracts } from '../../../../../../utils/test/carousel-control-contracts'
import ControlledAudit from './ControlledAudit.fixture.vue'

carouselControlContracts(async (onRequest, onConsumerEvent) => {
  const screen = await render(ControlledAudit, { props: { onRequest, onConsumerEvent } })
  return () => screen.unmount()
})

it('updates Vue Carousel consumer listener props without stale or duplicate callbacks', async () => {
  const onRequest = vi.fn()
  const onConsumerEvent = vi.fn()
  const screen = await render(ControlledAudit, { props: { onRequest, onConsumerEvent } })
  await expect.element(page.getByTestId('snap-count')).toHaveTextContent('3')
  await page.getByTestId('next').click()
  expect(onConsumerEvent).toHaveBeenCalledExactlyOnceWith('click')
  expect(onRequest).toHaveBeenCalledExactlyOnceWith(1)
  await page.getByTestId('update-handlers').click()
  await page.getByTestId('toggle-cancel').click()
  onConsumerEvent.mockClear()
  onRequest.mockClear()
  await page.getByTestId('next').click()
  expect(onConsumerEvent).toHaveBeenCalledExactlyOnceWith('updated:click')
  expect(onRequest).not.toHaveBeenCalled()
  await page.getByTestId('toggle-cancel').click()
  onConsumerEvent.mockClear()
  await page.getByTestId('next').click()
  expect(onConsumerEvent).toHaveBeenCalledExactlyOnceWith('updated:click')
  expect(onRequest).toHaveBeenCalledExactlyOnceWith(1)
  await screen.unmount()
})
