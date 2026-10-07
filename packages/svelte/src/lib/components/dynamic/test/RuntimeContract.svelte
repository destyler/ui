<script lang="ts">
  import type { UseDynamicProps } from '../hooks/use-dynamic.svelte'
  import { Dynamic, useDynamic } from '../index'

  let options = $state<UseDynamicProps>({ id: 'runtime-tags' })
  const api = useDynamic(() => options)
  export function update(next: Omit<UseDynamicProps, 'id'>) {
    options = { id: 'runtime-tags', ...next }
  }
  export function getApi() {
    return api()
  }
</script>
<Dynamic.RootProvider value={api}>
  <Dynamic.Input />
  <Dynamic.HiddenInput name="tags" />
</Dynamic.RootProvider>
