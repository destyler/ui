import type { HTMLProps, PolymorphicProps } from '~/factory'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { tourAnatomy } from '../anatomy'

export interface TourControlBaseProps extends PolymorphicProps {}
export interface TourControlProps extends HTMLProps<'div'>, TourControlBaseProps {}

export const TourControl = forwardRef<HTMLDivElement, TourControlProps>((props, ref) => (
  <ui.div {...tourAnatomy.build().control.attrs} {...props} ref={ref} />
))

TourControl.displayName = 'TourControl'
