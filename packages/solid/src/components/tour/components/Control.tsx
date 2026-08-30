import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { tourAnatomy } from '../anatomy'

export interface TourControlBaseProps extends PolymorphicProps<'div'> {}
export interface TourControlProps extends HTMLProps<'div'>, TourControlBaseProps {}

export function TourControl(props: TourControlProps) {
  const mergedProps = mergeProps(() => tourAnatomy.build().control.attrs, props)

  return <ui.div {...mergedProps} />
}
