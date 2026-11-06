import type { AllowedComponentProps, ComponentCustomProps, ExtractPropTypes, IntrinsicElementAttributes, VNodeProps } from 'vue'
import {
  defineComponent,
  h,
} from 'vue'
import { useOnceListenerComposition } from '../utils/core-listeners'
import { Dynamic } from '../utils/dynamic'

type DOMElements = keyof IntrinsicElementAttributes
type ElementType = Parameters<typeof h>[0]

export interface PolymorphicProps {
  /**
   * Use the provided child element as the default rendered element, combining their props and behavior.
   */
  asChild?: boolean
}

export interface AsChildComponent<
  Component extends ElementType,
  P extends Record<string, unknown> = Record<never, never>,
> {
  new (): {
    $props: AllowedComponentProps
      & ComponentCustomProps
      & VNodeProps
      & ExtractPropTypes<Component>
      & (Component extends keyof IntrinsicElementAttributes
        ? IntrinsicElementAttributes[Component]
        : Record<never, never>)
      & P
      & PolymorphicProps
  }
}

export type HTMLPolymorphicComponents = {
  [E in DOMElements]: AsChildComponent<E>
}

export type HTMLPolymorphicProps<T extends ElementType> = Omit<
  // If T is the keyof a DOM element (i.e. `img`) then need to obtain that element's attribute object to extract props.
  // Otherwise, return T which could be a component (`DefineComponent` definition)
  ExtractPropTypes<T extends DOMElements ? IntrinsicElementAttributes[T] : T>,
  'ref'
> & {
  asChild?: boolean
}

export type HTMLUIProps<T extends DOMElements> = HTMLPolymorphicProps<T>

// Match Vue SSR: native HTML void elements cannot contain slot children.
const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

function withAsChild(component: ElementType) {
  const isVoidElement = typeof component === 'string' && voidElements.has(component)
  return defineComponent({
    name: 'Polymorphic',
    inheritAttrs: false,
    props: {
      __uiComposeOnce: Object,
      asChild: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { attrs, slots }) {
      const composeOnce = useOnceListenerComposition()
      return () => props.asChild
        ? h(Dynamic, { ...attrs, __uiComposeOnce: props.__uiComposeOnce }, { default: slots.default })
        : composeOnce(h(component, { ...attrs }, isVoidElement ? undefined : slots.default?.()), props.__uiComposeOnce)
    },
  })
}

export function jsxFactory() {
  const cache = new Map()

  const factory = new Proxy(withAsChild, {
    apply(_target, _thisArg, argArray) {
      return withAsChild(argArray[0])
    },
    get(_, element) {
      const asElement = element as unknown as ElementType
      if (!cache.has(asElement)) {
        cache.set(asElement, withAsChild(asElement))
      }
      return cache.get(asElement)
    },
  }) as unknown as HTMLPolymorphicComponents

  return factory
}

export const ui = jsxFactory()
