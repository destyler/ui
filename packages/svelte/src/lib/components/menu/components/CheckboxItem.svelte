<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { OptionItemProps } from '@destyler/menu'

  type PartialOptionItemProps = Omit<OptionItemProps, 'type'>
  type CheckboxMachineProps = Omit<PartialOptionItemProps, 'checked'>

  export interface MenuCheckboxItemBaseProps extends PartialOptionItemProps, PolymorphicProps<'div'> {}
  export interface MenuCheckboxItemProps extends Assign<HTMLProps<'div'>, MenuCheckboxItemBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'
  import { MenuItemProvider } from '../hooks/use-menu-item-context'
  import { MenuItemPropsProvider } from '../hooks/use-menu-option-item-props-context'

  let { checked = $bindable<boolean>(), ...props }: MenuCheckboxItemProps = $props()

  const [partialOptionItemProps, localProps] = $derived(
    createSplitProps<CheckboxMachineProps>()(props, [
      'closeOnSelect',
      'disabled',
      'onCheckedChange',
      'value',
      'valueText',
    ]),
  )

  const optionItemProps = $derived<OptionItemProps>({
    ...partialOptionItemProps,
    type: 'checkbox',
    checked,
    onCheckedChange(nextChecked) {
      if (checked !== undefined) checked = nextChecked
      partialOptionItemProps.onCheckedChange?.(nextChecked)
    },
  })

  const menu = useRequiredMenuContext()
  const mergedProps = $derived(mergeProps(menu().getOptionItemProps(optionItemProps), localProps))
  const optionItemState = $derived(menu().getOptionItemState(optionItemProps))

  MenuItemPropsProvider(() => optionItemProps)
  MenuItemProvider(() => optionItemState)
</script>

<UI as="div" {...mergedProps} />
