import type { UseColorPickerProps } from '../hooks/use-color-picker'
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
import { useColorPicker } from '../hooks/use-color-picker'
import { ColorPickerProvider } from '../hooks/use-color-picker-context'

export interface ColorPickerRootBaseProps
  extends UseColorPickerProps,
  UsePresenceProps,
  PolymorphicProps<'div'> {}
export interface ColorPickerRootProps extends HTMLProps<'div'>, ColorPickerRootBaseProps {}

export function ColorPickerRoot(props: ColorPickerRootProps) {
  const [presenceProps, colorPickerProps] = splitPresenceProps(props)
  const [useColorPickerProps, localProps] = createSplitProps<UseColorPickerProps>()(
    colorPickerProps,
    [
      'closeOnSelect',
      'defaultOpen',
      'defaultValue',
      'disabled',
      'format',
      'id',
      'ids',
      'initialFocusEl',
      'invalid',
      'name',
      'name',
      'onFocusOutside',
      'onFormatChange',
      'onInteractOutside',
      'onOpenChange',
      'onPointerDownOutside',
      'onValueChange',
      'onValueChangeEnd',
      'open',
      'openAutoFocus',
      'positioning',
      'readOnly',
      'required',
      'value',
    ],
  )
  const api = useColorPicker(useColorPickerProps)
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })))
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <ColorPickerProvider value={api}>
      <PresenceProvider value={apiPresence}>
        <ui.div {...mergedProps} />
      </PresenceProvider>
    </ColorPickerProvider>
  )
}
