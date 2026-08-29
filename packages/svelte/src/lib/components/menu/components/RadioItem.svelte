<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { OptionItemProps } from '@destyler/menu'

  type PartialOptionItemProps = Omit<OptionItemProps, 'type' | 'checked' | 'onCheckedChange'>

  export interface MenuRadioItemBaseProps extends PartialOptionItemProps, PolymorphicProps<'div'> {}
  export interface MenuRadioItemProps extends Assign<HTMLProps<'div'>, MenuRadioItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'
  import { MenuItemProvider } from '../hooks/use-menu-item-context'
  import { useMenuItemGroupContext } from '../hooks/use-menu-item-group-context'
  import { MenuItemPropsProvider } from '../hooks/use-menu-option-item-props-context'

  const props: MenuRadioItemProps = $props()

  const [partialItemProps, localProps] = $derived(
    createSplitProps<PartialOptionItemProps>()(props, ['closeOnSelect', 'disabled', 'value', 'valueText']),
  )

  const menu = useRequiredMenuContext()
  const itemGroup = useMenuItemGroupContext()

  const optionItemProps: OptionItemProps = $derived({
    ...partialItemProps,
    checked: itemGroup().value === partialItemProps.value,
    type: 'radio',
    onCheckedChange: () => itemGroup().onValueChange?.({ value: partialItemProps.value }),
  })

  const mergedProps = $derived(mergeProps(menu().getOptionItemProps(optionItemProps), localProps))
  const optionItemState = $derived(menu().getOptionItemState(optionItemProps))

  MenuItemPropsProvider(() => optionItemProps)
  MenuItemProvider(() => optionItemState)
</script>

<UI as="div" {...mergedProps} />
