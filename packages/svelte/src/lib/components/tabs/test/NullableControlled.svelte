<script lang="ts">
  import { untrack } from 'svelte'
  import { Tabs } from '../index'
  const { initial, onChange }: { initial: string | null, onChange: (value: string | null) => void } = $props()
  let value = $state<string | null>(untrack(() => initial))
</script>

<button onclick={() => { value = null }}>Parent clear</button>
<button onclick={() => { value = 'alpha' }}>Parent restore</button>
<output>{value ?? 'none'}</output>
<Tabs.Root bind:value onValueChange={details => onChange(details.value)}>
  <Tabs.List><Tabs.Trigger value="alpha">Alpha</Tabs.Trigger><Tabs.Trigger value="beta">Beta</Tabs.Trigger></Tabs.List>
  <Tabs.Content value="alpha">Alpha content</Tabs.Content><Tabs.Content value="beta">Beta content</Tabs.Content>
</Tabs.Root>
