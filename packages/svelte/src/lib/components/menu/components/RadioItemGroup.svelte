<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseMenuItemGroupContext } from '../hooks/use-menu-item-group-context'

  type OptionalUseMenuItemGroupContext = Optional<ReturnType<UseMenuItemGroupContext>, 'id'>

  export interface MenuRadioItemGroupBaseProps extends OptionalUseMenuItemGroupContext, PolymorphicProps<'div'> {}
  export interface MenuRadioItemGroupProps extends Assign<HTMLProps<'div'>, MenuRadioItemGroupBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'
  import { MenuItemGroupProvider, type ValueChangeDetails } from '../hooks/use-menu-item-group-context'

  let {
    id: providedId,
    value = $bindable<string>(),
    onValueChange,
    ...localProps
  }: MenuRadioItemGroupProps = $props()
  const generatedId = $props.id()

  const menu = useRequiredMenuContext()
  const itemGroupProps = $derived({
    id: providedId ?? generatedId,
    value,
    onValueChange(details: ValueChangeDetails) {
      if (value !== undefined) value = details.value
      onValueChange?.(details)
    },
  })
  const mergedProps = $derived(mergeProps(menu().getItemGroupProps({ id: itemGroupProps.id }), localProps))

  MenuItemGroupProvider(() => itemGroupProps)
</script>

<UI as="div" {...mergedProps} />
