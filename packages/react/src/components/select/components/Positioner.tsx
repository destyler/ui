import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectPositionerBaseProps extends PolymorphicProps {}
export interface SelectPositionerProps extends HTMLProps<'div'>, SelectPositionerBaseProps {}

export const SelectPositioner = forwardRef<HTMLDivElement, SelectPositionerProps>((props, ref) => {
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getPositionerProps(), props)
  const presence = usePresenceContext()

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

SelectPositioner.displayName = 'SelectPositioner'
