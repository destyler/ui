import { useState } from 'react'
import { Carousel } from '../index'

export function ControlledAudit(props: { onRequest: (page: number) => void }) {
  const [page, setPage] = useState(0)
  const [pending, setPending] = useState(0)
  const [accept, setAccept] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [mounted, setMounted] = useState(true)
  const prevent = (event: { preventDefault: () => void }) => {
    if (cancel)
      event.preventDefault()
  }
  return (
    <>
      <output data-testid="parent-page">{page}</output>
      <button data-testid="accept-pending" onClick={() => setPage(pending)}>Accept pending</button>
      <button data-testid="parent-zero" onClick={() => setPage(0)}>Parent zero</button>
      <button data-testid="toggle-accept" onClick={() => setAccept(value => !value)}>Toggle acceptance</button>
      <button data-testid="toggle-cancel" onClick={() => setCancel(value => !value)}>Toggle cancellation</button>
      <button data-testid="toggle-mounted" onClick={() => setMounted(value => !value)}>Toggle mount</button>
      {mounted && (
        <Carousel.Root
          page={page}
          slideCount={3}
          style={{ width: '300px' }}
          onPageChange={(details) => {
            setPending(details.page)
            props.onRequest(details.page)
            if (accept)
              setPage(details.page)
          }}
        >
          <Carousel.Context>{api => <><output data-testid="api-page">{api.page}</output><output data-testid="snap-count">{api.pageSnapPoints.length}</output></>}</Carousel.Context>
          <Carousel.PrevTrigger data-testid="previous" onClick={prevent}>Previous</Carousel.PrevTrigger>
          <Carousel.NextTrigger data-testid="next" onClick={prevent}>Next</Carousel.NextTrigger>
          <Carousel.IndicatorGroup onKeyDown={prevent}>
            <Carousel.Indicator index={0} data-testid="indicator-zero" onClick={prevent}>First</Carousel.Indicator>
            <Carousel.Indicator index={2} data-testid="indicator-two" onClick={prevent}>Third</Carousel.Indicator>
            <Carousel.Indicator index={1} data-testid="readonly-indicator" readOnly>Readonly</Carousel.Indicator>
          </Carousel.IndicatorGroup>
          <Carousel.ItemGroup style={{ height: '80px' }}>
            {[0, 1, 2].map(index => <Carousel.Item index={index} key={index}>Slide {index}</Carousel.Item>)}
          </Carousel.ItemGroup>
        </Carousel.Root>
      )}
    </>
  )
}
