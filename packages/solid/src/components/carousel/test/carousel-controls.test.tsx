import { render } from '@solidjs/testing-library'
import { carouselControlContracts } from '../../../../../../utils/test/carousel-control-contracts'
import { ControlledAudit } from './ControlledAudit.fixture'

carouselControlContracts((onRequest, onConsumerEvent) => {
  const screen = render(() => <ControlledAudit onRequest={onRequest} onConsumerEvent={onConsumerEvent} />)
  return () => screen.unmount()
})
