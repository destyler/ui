import type { VNode } from 'vue'
import { mergeProps } from '@destyler/vue'
import { cloneVNode, defineComponent, Fragment, mergeProps as mergeVNodeProps } from 'vue'

export const Dynamic = defineComponent({
  name: 'Dynamic',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
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
          if (/^on[^a-z]/.test(prop) && (Array.isArray(attrs[prop]) || Array.isArray(childProps[prop]))) {
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

        return children.length === 1 ? cloned : [cloned, ...otherChildren]
      }

      return children
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
