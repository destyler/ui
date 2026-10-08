import { render } from 'vitest-browser-react'
import { carouselControlContracts } from '../../../../../../utils/test/carousel-control-contracts'
import { ControlledAudit } from './ControlledAudit.fixture'

carouselControlContracts(async (onRequest, onConsumerEvent) => {
  const screen = await render(<ControlledAudit onRequest={onRequest} onConsumerEvent={onConsumerEvent} />)
  return () => screen.unmount()
})
