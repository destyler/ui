<script lang="ts">
  import type { UseDynamicProps } from '../index'
  import { Dynamic, useDynamic } from '../index'

  const props: Omit<UseDynamicProps, 'id'> = $props()
  const id = $props.id()
  const dynamic = useDynamic(() => ({ id, ...props }))
</script>

<Dynamic.RootProvider value={dynamic}>
  <output data-testid="value">{JSON.stringify(dynamic().value)}</output>
  <Dynamic.Input placeholder="Add tag" />
  <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
</Dynamic.RootProvider>
