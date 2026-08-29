<script lang="ts">
  import { useMachine } from '$lib/hooks'
  import { createMachine, ref } from '@destyler/xstate'

  class IdentityProbe {
    readonly value = 'class-instance'
  }

  const probe = ref(new IdentityProbe())
  const [state, send] = useMachine(() => createMachine({
    id: 'svelte-machine-adapter-test',
    initial: 'idle',
    context: {
      probe,
      initialActionRan: false,
    },
    states: {
      idle: {
        entry: 'markStarted',
        on: {
          ADVANCE: 'done',
        },
      },
      done: {},
    },
  }), {
    actions: {
      markStarted(ctx) {
        ctx.initialActionRan = true
      },
    },
  })

  const preservesIdentity = $derived(
    state.context.probe === probe
      && state.context.probe instanceof IdentityProbe
      && state.context.probe.value === 'class-instance',
  )
  const matches = $derived(state.matches)
</script>

<output data-testid="class-identity">{preservesIdentity ? 'preserved' : 'lost'}</output>
<output data-testid="initial-action">{state.context.initialActionRan ? 'ran' : 'missed'}</output>
<output data-testid="machine-state">{matches('done') ? 'done' : 'idle'}</output>
<button type="button" onclick={() => send('ADVANCE')}>Advance machine</button>
