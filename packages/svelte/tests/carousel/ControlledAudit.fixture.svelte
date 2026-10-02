<script lang="ts">
  import { Carousel } from '../../src/lib/components/carousel'

  let { onRequest, onConsumerEvent }: { onRequest: (page: number) => void, onConsumerEvent: (type: string) => void } = $props()
  let page = $state(0)
  let pending = $state(0)
  let dragStarts = $state(0)
  let accept = $state(false)
  let cancel = $state(false)
  let mounted = $state(true)
  function request(details: { page: number }) {
    pending = details.page
    onRequest(details.page)
    if (accept)
      page = details.page
  }
  function prevent(event: Event) {
    onConsumerEvent(event.type)
    if (cancel)
      event.preventDefault()
  }
</script>

<output data-testid="drag-start-count">{dragStarts}</output>
<output data-testid="parent-page">{page}</output>
<button data-testid="accept-pending" onclick={() => page = pending}>Accept pending</button>
<button data-testid="parent-zero" onclick={() => page = 0}>Parent zero</button>
<button data-testid="toggle-accept" onclick={() => accept = !accept}>Toggle acceptance</button>
<button data-testid="toggle-cancel" onclick={() => cancel = !cancel}>Toggle cancellation</button>
<button data-testid="toggle-mounted" onclick={() => mounted = !mounted}>Toggle mount</button>
{#if mounted}
  <Carousel.Root {page} slideCount={3} allowMouseDrag onDragStatusChange={({ type }) => { if (type === 'dragging.start') dragStarts++ }} style="width: 300px" onPageChange={request}>
    <Carousel.Context>
      {#snippet render(api)}
        <output data-testid="api-page">{api().page}</output>
        <output data-testid="snap-count">{api().pageSnapPoints.length}</output>
        <output data-testid="playing">{String(api().isPlaying)}</output>
      {/snippet}
    </Carousel.Context>
    <Carousel.PrevTrigger data-testid="previous" onclick={prevent}>Previous</Carousel.PrevTrigger>
    <Carousel.NextTrigger data-testid="next" onclick={prevent}>Next</Carousel.NextTrigger>
    <Carousel.AutoplayTrigger data-testid="autoplay" onclick={prevent}>Autoplay</Carousel.AutoplayTrigger>
    <Carousel.IndicatorGroup onkeydown={prevent}>
      <Carousel.Indicator index={0} data-testid="indicator-zero" onclick={prevent}>First</Carousel.Indicator>
      <Carousel.Indicator index={2} data-testid="indicator-two" onclick={prevent}>Third</Carousel.Indicator>
      <Carousel.Indicator index={1} data-testid="readonly-indicator" readOnly>Readonly</Carousel.Indicator>
    </Carousel.IndicatorGroup>
    <Carousel.ItemGroup data-testid="item-group" onmousedown={prevent} style="height: 80px">
      {#each [0, 1, 2] as index (index)}<Carousel.Item {index}>Slide {index}</Carousel.Item>{/each}
    </Carousel.ItemGroup>
  </Carousel.Root>
{/if}
