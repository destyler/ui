<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { CollectionItem } from '../../collection'
  import type { UseComboboxContext } from '../hooks/use-combobox-context'

  export interface ComboboxContextProps<T extends CollectionItem> {
    render: Snippet<[UseComboboxContext<T>]>
  }
</script>

<script lang="ts" generics="T extends CollectionItem">
  import { useComboboxContext } from '../hooks/use-combobox-context'

  const { render }: ComboboxContextProps<T> = $props()

  const context = useComboboxContext()
</script>

{@render render(context)}
