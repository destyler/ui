<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface RadioItemHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface RadioItemHiddenInputProps
    extends Assign<HTMLProps<'input'>, RadioItemHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { tick } from 'svelte'
  import { UI } from '../../factory'
  import { useRadioContext } from '../hooks/use-radio-context'
  import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

  const props: RadioItemHiddenInputProps = $props()

  const radioGroup = useRadioContext()
  const itemProps = useRadioItemPropsContext()

  const mergedProps = $derived(mergeProps(radioGroup().getItemHiddenInputProps(itemProps()), props, {
    async onclick(event: MouseEvent) {
      const input = event.currentTarget as HTMLInputElement
      await tick()
      if (!input.isConnected)
        return
      // Native radio activation also unchecks the previous item. Restore every
      // input owned by this group when a controlled parent rejects the request.
      const root = input.getRootNode() as Document | ShadowRoot
      for (const item of root.querySelectorAll<HTMLInputElement>('input[type="radio"][data-ownedby]')) {
        if (item.dataset.ownedby === input.dataset.ownedby)
          item.checked = radioGroup().getItemState({ value: item.value }).checked
      }
    },
  }))
</script>

<UI as="input" {...mergedProps} />
