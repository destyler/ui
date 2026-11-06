import type { VNode } from 'vue'
import { mergeProps } from '@destyler/vue'
import { cloneVNode, defineComponent, Fragment, mergeProps as mergeVNodeProps } from 'vue'

import { rememberOnceCallbacks, useOnceListenerComposition } from './core-listeners'

export const Dynamic = defineComponent({
  name: 'Dynamic',
  inheritAttrs: false,
  props: { __uiComposeOnce: Object },
  setup(props, { attrs, slots }) {
    const composeOnce = useOnceListenerComposition()
    return () => {
      if (!slots.default)
        return null
      const children = renderSlotFragments(slots.default())
      const [firstChildren, ...otherChildren] = children

      if (Object.keys(attrs).length > 0) {
        delete firstChildren.props?.ref
        const childProps = firstChildren.props ?? {}
        const mergedProps = mergeProps(attrs, childProps)
        // Vue can supply arrays even when each original listener is a function.
        // Keep them native so Vue preserves error handling and stopImmediatePropagation.
        for (const prop in mergedProps) {
          const onceCore = props.__uiComposeOnce?.[prop.slice(0, -4)]
          if (/^on[^a-z]/.test(prop) && prop.endsWith('Once') && !/(?:Capture|Passive)Once$/.test(prop)
            && typeof attrs[prop] === 'function' && typeof childProps[prop] === 'function') {
            rememberOnceCallbacks(mergedProps[prop], mergeVNodeProps({ [prop]: childProps[prop] }, { [prop]: attrs[prop] })[prop])
          }
          if (/^on[^a-z]/.test(prop) && (Array.isArray(attrs[prop]) || Array.isArray(childProps[prop])
            || ((typeof onceCore === 'function' || Array.isArray(onceCore)) && typeof firstChildren.type === 'string' && prop.endsWith('Once') && !/(?:Capture|Passive)Once$/.test(prop)))) {
            mergedProps[prop] = mergeVNodeProps({ [prop]: childProps[prop] }, { [prop]: attrs[prop] })[prop]
          }
        }
        const cloned = cloneVNode(firstChildren, mergedProps)
        for (const prop in mergedProps) {
          if (prop.startsWith('on')) {
            cloned.props ||= {}
            cloned.props[prop] = mergedProps[prop]
          }
        }

        const result = composeOnce(cloned, props.__uiComposeOnce)
        return children.length === 1 ? result : [result, ...otherChildren]
      }

      return children.map((child, index) => index === 0 ? composeOnce(child, props.__uiComposeOnce) : child)
    }
  },
})

function renderSlotFragments(children?: VNode[]): VNode[] {
  if (!children)
    return []
  return children.flatMap((child) => {
    if (child.type === Fragment)
      return renderSlotFragments(child.children as VNode[])

    return [child]
  })
}
