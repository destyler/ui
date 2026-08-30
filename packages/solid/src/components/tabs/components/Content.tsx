import type { ContentProps } from '@destyler/tabs'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { PresenceProvider, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useRenderStrategyContext } from '~/utils/render-strategy'
import { useTabsContext } from '../hooks/use-tabs-context'

export interface TabContentBaseProps extends ContentProps, PolymorphicProps<'div'> {}
export interface TabContentProps extends HTMLProps<'div'>, TabContentBaseProps {}

export function TabContent(props: TabContentProps) {
  const [contentProps, localProps] = createSplitProps<ContentProps>()(props, ['value'])
  const api = useTabsContext()
  const renderStrategyProps = useRenderStrategyContext()
  const presenceApi = usePresence(
    mergeProps(renderStrategyProps, () => ({
      present: api().value === contentProps.value,
      immediate: true,
    })),
  )
  const mergedProps = mergeProps(
    () => api().getContentProps(contentProps),
    () => presenceApi().presenceProps,
    localProps,
  )

  return (
    <PresenceProvider value={presenceApi}>
      <Show when={!presenceApi().unmounted}>
        <ui.div {...mergedProps} />
      </Show>
    </PresenceProvider>
  )
}
