<script lang="ts">
  import { NumberInput, useNumberInput } from '$lib'
  import { untrack } from 'svelte'

  let { entry = 'root', mode = 'controlled', showInput = true, cancelReset = false, formId }: {
    entry?: 'root' | 'provider' | 'hook'
    mode?: 'controlled' | 'accepted' | 'uncontrolled'
    showInput?: boolean
    cancelReset?: boolean
    formId?: string
  } = $props()
  let parent = $state('10')
  const id = $props.id()
  const machineProps = $derived({
    id,
    name: 'answer',
    form: formId,
    value: mode === 'uncontrolled' ? undefined : parent,
    defaultValue: '10',
    formatOptions: { minimumFractionDigits: 2 },
    onValueChange(details: { value: string }) {
      if (mode === 'accepted')
        parent = details.value
    },
  })
  const api = untrack(() => entry === 'root' ? undefined : useNumberInput(() => machineProps))
</script>

<form id={`${id}-initial`} data-testid="form" onreset={(event) => { if (cancelReset) event.preventDefault() }}>
  {#if entry === 'root'}
    <NumberInput.Root {...machineProps}><NumberInput.Context render={parts} /></NumberInput.Root>
  {:else if entry === 'provider' && api}
    <NumberInput.RootProvider value={api}>{@render parts(api)}</NumberInput.RootProvider>
  {:else if api}
    {@render parts(api)}
  {/if}
  <button type="reset" data-testid="reset">Reset</button>
</form>
<form id={formId} data-testid="other-form"></form>

{#snippet parts(api: ReturnType<typeof useNumberInput>)}
  <span data-testid="api-state">{api().value}</span>
  {#if showInput}
    {#if entry === 'hook'}
      <input {...api().getInputProps()} data-testid="input" />
    {:else}
      <NumberInput.Input data-testid="input" />
    {/if}
  {/if}
{/snippet}
