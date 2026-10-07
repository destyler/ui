import type { Component, VNode } from 'vue'
import { cloneVNode, defineComponent, Fragment, h, isVNode } from 'vue'
import { ui } from '~/factory'
import { isCarouselEvent, mergeCarouselProps } from './merge-carousel-props'

function slotChildren(children: VNode[]): VNode[] {
  return children.flatMap(child => child.type === Fragment && Array.isArray(child.children)
    ? slotChildren(child.children.filter(isVNode))
    : [child])
}

function carouselElement(tag: 'button' | 'div') {
  // The factory's public constructor shape is for templates, not h overloads.
  const Primitive = ui[tag] as Component
  return defineComponent({
    name: 'CarouselElement',
    inheritAttrs: false,
    props: { asChild: Boolean },
    setup(props, { attrs, slots }) {
      return () => {
        if (!props.asChild)
          return h(Primitive, attrs, slots)

        const children = slotChildren(slots.default?.() ?? [])
        const [first, ...rest] = children
        if (!first)
          return h(Primitive, { ...attrs, asChild: true }, slots)

        // Dynamic's shared prop merger only composes function/function events.
        // Put Vue-native arrays on the child, so that boundary merely forwards
        // them. Keep all non-event attrs, refs and rendering on the same factory.
        const merged = mergeCarouselProps(attrs, first.props ?? {})
        const events: Record<string, unknown> = {}
        const forwarded = { ...attrs }
        for (const key of Object.keys(merged)) {
          if (!isCarouselEvent(key))
            continue
          events[key] = merged[key]
          delete forwarded[key]
        }
        const child = cloneVNode(first, events)
        for (const key of Object.keys(events)) {
          child.props ||= {}
          child.props[key] = events[key]
        }
        return h(Primitive, { ...forwarded, asChild: true }, { default: () => [child, ...rest] })
      }
    },
  })
}

export const CarouselButton = carouselElement('button')
export const CarouselDiv = carouselElement('div')
