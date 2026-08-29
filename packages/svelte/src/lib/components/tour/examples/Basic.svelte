<script lang="ts">
  import { onMount } from 'svelte'
  import type { TourRootProps, TourStepDetails } from '../index'
  import { Tour, useTour } from '../index'

  let target: HTMLButtonElement
  const props: Omit<TourRootProps, 'tour'> = $props()
  const id = $props.id()

  const steps: TourStepDetails[] = [
    {
      id: 'step-1',
      type: 'tooltip',
      title: 'Welcome',
      description: 'Welcome to the tour!',
      target: () => target,
      arrow: true,
      backdrop: true,
    },
  ]

  const tour = useTour({ id, steps })

  onMount(() => tour().start())
</script>

<main>
  <button bind:this={target}>Target</button>

  <Tour.Root {tour} {...props}>
    <Tour.Backdrop />
    <Tour.Spotlight />
    <Tour.Positioner data-testid="positioner">
      <Tour.Content>
        <Tour.Arrow>
          <Tour.ArrowTip />
        </Tour.Arrow>
        <Tour.Title />
        <Tour.Description />
        <Tour.ProgressText />
        <Tour.Control>
          <Tour.ActionTrigger action={{ label: 'Prev', action: 'prev' }}>Prev</Tour.ActionTrigger>
          <Tour.ActionTrigger action={{ label: 'Next', action: 'next' }}>Next</Tour.ActionTrigger>
        </Tour.Control>
        <Tour.CloseTrigger>X</Tour.CloseTrigger>
      </Tour.Content>
    </Tour.Positioner>
  </Tour.Root>
</main>
