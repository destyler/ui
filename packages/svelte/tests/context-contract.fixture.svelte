<script lang="ts">
  import { useCheckboxContext, useCheckboxGroupContext } from '$lib/components/checkbox'
  import {
    useColorPickerChannelPropsContext,
    useColorPickerSwatchPropsContext,
  } from '$lib/components/color-picker'
  import { useFieldsetContext } from '$lib/components/fieldset'
  import { useMenuContext } from '$lib/components/menu'
  import { useMenuMachineContext } from '$lib/components/menu/hooks/use-menu-machine-context'
  import { useMenuTriggerItemContext } from '$lib/components/menu/hooks/use-menu-trigger-item-context'
  import { useNavigationMenuItemPropsContext } from '$lib/components/navigation-menu/hooks/use-navigation-menu-item-props-context'

  function readError(consumer: () => unknown) {
    try {
      consumer()
      return 'did-not-throw'
    }
    catch (error) {
      return error instanceof Error ? `${error.name}:${error.message}` : 'unknown-error'
    }
  }

  const checkboxError = readError(useCheckboxContext)
  const channelPropsError = readError(useColorPickerChannelPropsContext)
  const swatchPropsError = readError(useColorPickerSwatchPropsContext)
  const optionalContexts: unknown[] = [
    useCheckboxGroupContext(),
    useFieldsetContext(),
    useMenuContext(),
    useMenuMachineContext(),
    useMenuTriggerItemContext(),
    useNavigationMenuItemPropsContext(),
  ]
</script>

<output data-testid="checkbox-context-error">{checkboxError}</output>
<output data-testid="channel-props-context-error">{channelPropsError}</output>
<output data-testid="swatch-props-context-error">{swatchPropsError}</output>
<output data-testid="optional-contexts">
  {optionalContexts.every(context => context === undefined) ? 'all-absent' : 'unexpected-value'}
</output>
