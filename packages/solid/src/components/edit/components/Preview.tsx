import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { splitProps } from 'solid-js'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditPreviewBaseProps extends PolymorphicProps<'span'> {}
export interface EditPreviewProps extends HTMLProps<'span'>, EditPreviewBaseProps {}

export function EditPreview(props: EditPreviewProps) {
  const [localProps, restProps] = splitProps(props, ['children'])
  const api = useEditContext()
  const mergedProps = mergeProps(() => {
    const [, previewProps] = splitProps(api().getPreviewProps(), ['textContent'])
    return previewProps
  }, restProps)

  return <ui.span {...mergedProps}>{localProps.children ?? api().valueText}</ui.span>
}
