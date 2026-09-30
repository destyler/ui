<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CheckboxHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface CheckboxHiddenInputProps extends Assign<HTMLProps<'input'>, CheckboxHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { tick } from 'svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../../field'
  import { useCheckboxContext } from '../hooks/use-checkbox-context'

  const props: CheckboxHiddenInputProps = $props()

  const checkbox = useCheckboxContext()
  const field = useFieldContext()
  const mergedProps = $derived(mergeProps(checkbox().getHiddenInputProps(), props, {
    async onclick(event: MouseEvent) {
      const input = event.currentTarget as HTMLInputElement
      // Native activation toggles checked before the change request. A parent
      // may reject it without changing any reactive prop, so restore the
      // accepted state after bindings and the browser's default action settle.
      await tick()
      if (!input.isConnected)
        return
      input.checked = checkbox().checked
      input.indeterminate = checkbox().indeterminate
    },
  }))
</script>

<UI as="input" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps} />
