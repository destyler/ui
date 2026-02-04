import type { ContentProps } from '@destyler/tabs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { useDebounce } from '~/hooks/use-debounce'
import { composeRefs } from '~/utils/compose-refs'
import { createSplitProps } from '~/utils/create-split-props'
import { useRenderStrategyPropsContext } from '~/utils/render-strategy'
import { useTabsContext } from '../hooks/use-tabs-context'

export interface TabContentBaseProps extends ContentProps, PolymorphicProps {}
export interface TabContentProps extends HTMLProps<'div'>, TabContentBaseProps {}

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>((props, ref) => {
  const [contentProps, localProps] = createSplitProps<ContentProps>()(props, ['value'])
  const tabs = useTabsContext()
  const renderStrategyProps = useRenderStrategyPropsContext()

  const presence = usePresence({
    ...renderStrategyProps,
    present: useDebounce(tabs.value === props.value, 0),
    immediate: true,
  })

  const mergedProps = mergeProps(tabs.getContentProps(contentProps), presence.getPresenceProps(), localProps)

  return (
    <PresenceProvider value={presence}>
      {presence.unmounted ? null : <ui.div {...mergedProps} ref={composeRefs(presence.ref, ref)} />}
    </PresenceProvider>
  )
})

TabContent.displayName = 'TabContent'
