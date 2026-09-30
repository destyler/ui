<script lang="ts">
  import type { OpenApi, OpenFamily } from './open-cases'
  import { UI } from '$lib/components/factory'

  let { api, family }: { api: () => OpenApi; family: OpenFamily } = $props()
</script>

<output data-testid="api-open">{String(api().open)}</output>
<button type="button" data-testid="request-open" onclick={() => api().setOpen(true)}>Request open</button>
<button type="button" data-testid="request-close" onclick={() => api().setOpen(false)}>Request close</button>
{#if family === 'combobox'}
  <!-- Combobox uses Control as its same-width positioning reference. -->
  <UI as="label" {...api().getLabelProps?.()}>Options</UI>
  <UI as="div" {...api().getControlProps?.()}>
    <UI as="input" {...api().getInputProps?.()} />
    <UI as="button" {...api().getTriggerProps()} data-testid="trigger">Trigger</UI>
  </UI>
{:else}
  <UI as="button" {...api().getTriggerProps()} data-testid="trigger">Trigger</UI>
  {#if family === 'calendar'}
    <UI as="input" {...api().getInputProps?.()} />
  {/if}
{/if}
<UI as="div" {...api().getPositionerProps?.()}>
  <UI as="div" {...api().getContentProps()} data-testid="content">
    {#if family === 'combobox'}
      <UI as="div" {...api().getListProps?.()}>
        {#each ['one', 'two'] as item (item)}
          <UI as="div" {...api().getItemProps?.({ item })} data-testid={`option-${item}`}>{item}</UI>
        {/each}
      </UI>
    {:else}
      Content
    {/if}
  </UI>
</UI>
