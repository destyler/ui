import type { PropTypes } from '@destyler/react'
import * as navigationMenu from '@destyler/navigation-menu'
import { normalizeProps } from '@destyler/react'

type ConnectParameters = Parameters<typeof navigationMenu.connect<PropTypes>>

/**
 * Core 0.2.7 reads the trigger DOM to calculate content motion during render.
 * Before mount (including hydration), return the same static content contract
 * without a layout query. Keep the real core API for all mounted behavior.
 */
export function connectNavigationMenu(
  state: ConnectParameters[0],
  send: ConnectParameters[1],
  mounted: boolean,
): navigationMenu.Api<PropTypes> {
  const api = navigationMenu.connect(state, send, normalizeProps)
  if (mounted)
    return api

  const getContentState: typeof api.getContentState = props => ({
    open: api.value === props.value,
    motion: undefined,
  })

  return {
    ...api,
    getContentState,
    getContentProps(props) {
      const { value } = props
      const { open } = getContentState(props)
      return normalizeProps.element({
        ...navigationMenu.anatomy.build().content.attrs,
        'id': state.context.ids?.content?.(value) ?? `nav-menu:${state.context.id}:content:${value}`,
        'dir': state.context.dir,
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
        'data-motion': undefined,
        'data-value': value,
        'data-orientation': state.context.orientation,
        onPointerEnter(event) {
          if (event.pointerType === 'mouse')
            send({ type: 'CONTENT_ENTER', value })
        },
        onPointerLeave(event) {
          if (event.pointerType === 'mouse')
            send({ type: 'CONTENT_LEAVE', value })
        },
      })
    },
  }
}
