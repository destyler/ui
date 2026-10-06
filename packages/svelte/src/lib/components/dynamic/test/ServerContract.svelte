<script lang="ts">
  import { Dynamic } from '../index'
  import { EnvironmentProvider } from '$lib/providers/environment'
  let { value, defaultValue }: { value?: string[], defaultValue?: string[] } = $props()
  const rejectDocument = () => { throw new Error('Dynamic SSR must not access the DOM') }
  const ids = { input: 'entry-tags', hiddenInput: 'submitted-tags', item: ({ index, value }: { index: string | number, value: string }) => `preview-${index}-${value}`, itemInput: ({ index, value }: { index: string | number, value: string }) => `editor-${index}-${value}` }
</script>
<EnvironmentProvider value={rejectDocument}>
  <Dynamic.Root id="ssr-tags" name="tags" inputValue="Draft" {ids} {value} {defaultValue}>
    <Dynamic.Label>Tags</Dynamic.Label>
    <Dynamic.Control>
      <Dynamic.Context>
        {#snippet render(api)}
          {#each api().value as value, index (`${index}:${value}`)}
            <Dynamic.Item {value} {index}>
              <Dynamic.ItemPreview><Dynamic.ItemText>{value}</Dynamic.ItemText><Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger></Dynamic.ItemPreview>
              <Dynamic.ItemInput />
            </Dynamic.Item>
          {/each}
        {/snippet}
      </Dynamic.Context>
      <Dynamic.Input />
      <Dynamic.ClearTrigger>Clear</Dynamic.ClearTrigger>
    </Dynamic.Control>
    <Dynamic.HiddenInput />
  </Dynamic.Root>
</EnvironmentProvider>
