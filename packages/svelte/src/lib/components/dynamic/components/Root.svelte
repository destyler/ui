<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseDynamicProps } from '../hooks/use-dynamic.svelte'

  export interface DynamicRootBaseProps extends Optional<UseDynamicProps, 'id'>, PolymorphicProps<'div'> {}
  export interface DynamicRootProps extends Assign<HTMLProps<'div'>, DynamicRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { UI } from '../../factory'
  import { DynamicProvider } from '../hooks/use-dynamic-context'
  import { useDynamic } from '../hooks/use-dynamic.svelte'

  let { value = $bindable<string[]>(), inputValue = $bindable<string>(), ...props }: DynamicRootProps = $props()

  const [useDynamicProps, localProps] = $derived(
    createSplitProps<Optional<UseDynamicProps, 'id'>>()(props, [
      'addOnPaste',
      'allowOverflow',
      'autoFocus',
      'blurBehavior',
      'defaultValue',
      'delimiter',
      'disabled',
      'editable',
      'form',
      'id',
      'ids',
      'inputValue',
      'invalid',
      'max',
      'maxLength',
      'name',
      'onFocusOutside',
      'onHighlightChange',
      'onInputValueChange',
      'onInteractOutside',
      'onPointerDownOutside',
      'onValueChange',
      'onValueInvalid',
      'readOnly',
      'required',
      'translations',
      'validate',
      'value',
    ]),
  )

  const providedId = $props.id()

  const machineProps = $derived.by<UseDynamicProps>(() => {
    return {
      ...useDynamicProps,
      id: useDynamicProps.id ?? providedId,
      value,
      inputValue,
      onValueChange: (details) => {
        useDynamicProps.onValueChange?.(details)
        value = details.value
      },
      onInputValueChange: (details) => {
        useDynamicProps.onInputValueChange?.(details)
        inputValue = details.inputValue
      },
    }
  })

  const dynamic = useDynamic(() => machineProps)
  const mergedProps = $derived(mergeProps(dynamic().getRootProps(), localProps))

  DynamicProvider(() => dynamic())
</script>

<UI as="div" {...mergedProps} />
