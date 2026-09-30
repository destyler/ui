<script lang="ts">
  import type { OpenApi, OpenFamily } from './open-cases'
  import { UI } from '$lib/components/factory'

  let { api, family }: { api: () => OpenApi; family: OpenFamily } = $props()
</script>

<output data-testid="api-open">{String(api().open)}</output>
<button type="button" data-testid="request-open" onclick={() => api().setOpen(true)}>Request open</button>
<button type="button" data-testid="request-close" onclick={() => api().setOpen(false)}>Request close</button>
<UI as="button" {...api().getTriggerProps()} data-testid="trigger">Trigger</UI>
{#if family === 'calendar' || family === 'combobox'}
  <UI as="input" {...api().getInputProps?.()} />
{/if}
<UI as="div" {...api().getPositionerProps?.()}>
  <UI as="div" {...api().getContentProps()} data-testid="content">Content</UI>
</UI>
