<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseToggleProps } from '../hooks/use-toggle.svelte'

  export interface ToggleRootBaseProps extends UseToggleProps, PolymorphicProps<'button'> {}
  export interface ToggleRootProps extends Assign<HTMLProps<'button'>, ToggleRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { UI } from '../../factory'
  import { useToggle } from '../hooks/use-toggle.svelte'
  import { ToggleProvider } from '../hooks/use-toggle-context'

  let { pressed = $bindable<boolean>(), ...props }: ToggleRootProps = $props()

  const [useToggleProps, localProps] = $derived(
    createSplitProps<UseToggleProps>()(props, ['pressed', 'defaultPressed', 'disabled', 'onPressedChange']),
  )

  const machineProps = $derived.by<UseToggleProps>(() => ({
    ...useToggleProps,
    pressed,
    onPressedChange(nextPressed) {
      useToggleProps.onPressedChange?.(nextPressed)
      pressed = nextPressed
    },
  }))

  const toggle = useToggle(() => machineProps)
  const mergedProps = $derived(mergeProps(toggle().getRootProps(), localProps))

  ToggleProvider(toggle)
</script>

<UI as="button" {...mergedProps} />
