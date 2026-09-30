<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SwitchHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface SwitchHiddenInputProps extends Assign<HTMLProps<'input'>, SwitchHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { tick } from 'svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../../field'
  import { useSwitchContext } from '../hooks/use-switch-context'

  const props: SwitchHiddenInputProps = $props()

  const switchMachine = useSwitchContext()
  const field = useFieldContext()
  const mergedProps = $derived(mergeProps(switchMachine().getHiddenInputProps(), props, {
    async onclick(event: MouseEvent) {
      const input = event.currentTarget as HTMLInputElement
      // Native activation toggles checked before the change request. A parent
      // may reject it without changing any reactive prop, so restore the
      // accepted state after bindings and the browser's default action settle.
      await tick()
      if (!input.isConnected)
        return
      input.checked = switchMachine().checked
    },
  }))
</script>

<UI as="input" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps} />
