<script lang="ts">
  import type { ActionTriggerProps } from '@destyler/timer'
  import { Timer } from '../index'

  let { asChild = false, onclick }: { asChild?: boolean, onclick?: (event: MouseEvent) => void } = $props()
  let action = $state<ActionTriggerProps['action']>('start')

  export function setAction(value: ActionTriggerProps['action']) {
    action = value
  }
</script>

<Timer.Root startMs={60000} countdown>
  <Timer.Context>
    {#snippet api(timer)}
      <output data-running={String(timer().running)} data-paused={String(timer().paused)}></output>
    {/snippet}
  </Timer.Context>
  {#if asChild}
    <Timer.ActionTrigger {action} {onclick} class="timer-action" data-testid="trigger" aria-label="Timer action">
      {#snippet asChild(props)}
        <button {...props({ 'data-child': 'true' })}>Action</button>
      {/snippet}
    </Timer.ActionTrigger>
  {:else}
    <Timer.ActionTrigger {action} {onclick} class="timer-action" data-testid="trigger" aria-label="Timer action">Action</Timer.ActionTrigger>
  {/if}
</Timer.Root>
