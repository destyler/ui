import { createSignal, Show } from 'solid-js'
import { Carousel } from '../index'

export function ControlledAudit(props: { onRequest: (page: number) => void, onConsumerEvent: (type: string) => void }) {
  const [page, setPage] = createSignal(0)
  const [dragStarts, setDragStarts] = createSignal(0)
  const [pending, setPending] = createSignal(0)
  const [accept, setAccept] = createSignal(false)
  const [cancel, setCancel] = createSignal(false)
  const [mounted, setMounted] = createSignal(true)
  const prevent = (event: { type: string, preventDefault: () => void }) => {
    props.onConsumerEvent(event.type)
    if (cancel())
      event.preventDefault()
  }
  return (
    <>
      <output data-testid="drag-start-count">{dragStarts()}</output>
      <output data-testid="parent-page">{page()}</output>
      <button data-testid="accept-pending" onClick={() => setPage(pending())}>Accept pending</button>
      <button data-testid="parent-zero" onClick={() => setPage(0)}>Parent zero</button>
      <button data-testid="toggle-accept" onClick={() => setAccept(value => !value)}>Toggle acceptance</button>
      <button data-testid="toggle-cancel" onClick={() => setCancel(value => !value)}>Toggle cancellation</button>
      <button data-testid="toggle-mounted" onClick={() => setMounted(value => !value)}>Toggle mount</button>
      <Show when={mounted()}>
        <Carousel.Root
          page={page()}
          allowMouseDrag
          onDragStatusChange={({ type }) => {
            if (type === 'dragging.start')
              setDragStarts(value => value + 1)
          }}
          slideCount={3}
          style={{ width: '300px' }}
          onPageChange={(details) => {
            setPending(details.page)
            props.onRequest(details.page)
            if (accept())
              setPage(details.page)
          }}
        >
          <Carousel.Context>{api => <><output data-testid="api-page">{api().page}</output><output data-testid="snap-count">{api().pageSnapPoints.length}</output><output data-testid="playing">{String(api().isPlaying)}</output></>}</Carousel.Context>
          <Carousel.PrevTrigger data-testid="previous" onClick={prevent}>Previous</Carousel.PrevTrigger>
          <Carousel.NextTrigger data-testid="next" onClick={prevent}>Next</Carousel.NextTrigger>
          <Carousel.AutoplayTrigger data-testid="autoplay" onClick={prevent}>Autoplay</Carousel.AutoplayTrigger>
          <Carousel.IndicatorGroup onKeyDown={prevent}>
            <Carousel.Indicator index={0} data-testid="indicator-zero" onClick={prevent}>First</Carousel.Indicator>
            <Carousel.Indicator index={2} data-testid="indicator-two" onClick={prevent}>Third</Carousel.Indicator>
            <Carousel.Indicator index={1} data-testid="readonly-indicator" readOnly>Readonly</Carousel.Indicator>
          </Carousel.IndicatorGroup>
          <Carousel.ItemGroup data-testid="item-group" onMouseDown={prevent} style={{ height: '80px' }}>
            {[0, 1, 2].map(index => <Carousel.Item index={index}>Slide {index}</Carousel.Item>)}
          </Carousel.ItemGroup>
        </Carousel.Root>
      </Show>
    </>
  )
}
