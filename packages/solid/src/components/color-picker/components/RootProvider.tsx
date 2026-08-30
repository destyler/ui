import type { UseColorPickerReturn } from '../hooks/use-color-picker'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ColorPickerProvider } from '../hooks/use-color-picker-context'

interface RootProviderProps {
  value: UseColorPickerReturn
}

export interface ColorPickerRootProviderBaseProps
  extends RootProviderProps,
  UsePresenceProps,
  PolymorphicProps<'div'> {}
export interface ColorPickerRootProviderProps
  extends HTMLProps<'div'>,
  ColorPickerRootProviderBaseProps {}

export function ColorPickerRootProvider(props: ColorPickerRootProviderProps) {
  const [presenceProps, colorPickerProps] = splitPresenceProps(props)
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(
    colorPickerProps,
    ['value'],
  )
  const colorPicker: UseColorPickerReturn = () => providerProps.value()
  const apiPresence = usePresence(
    mergeProps(() => ({ present: colorPicker().open }), presenceProps),
  )
  const mergedProps = mergeProps(() => colorPicker().getRootProps(), localProps)

  return (
    <ColorPickerProvider value={colorPicker}>
      <PresenceProvider value={apiPresence}>
        <ui.div {...mergedProps} />
      </PresenceProvider>
    </ColorPickerProvider>
  )
}
