import type { ComponentProps, JSX } from 'solid-js'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { composeRefs } from '~/utils/compose-refs'

type ElementType = keyof JSX.IntrinsicElements

type JsxElements = {
  [E in ElementType]: UIComponent<E>
}

type ParentProps<T extends ElementType> = (
  userProps?: JSX.IntrinsicElements[T],
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) => JSX.HTMLAttributes<any>

export interface PolymorphicProps<T extends ElementType> {
  /**
   * Use the provided child element as the default rendered element, combining their props and behavior.
   */
  asChild?: (props: ParentProps<T>) => JSX.Element
}
export type HTMLProps<E extends ElementType> = JSX.IntrinsicElements[E]
export type HTMLUIProps<E extends ElementType> = Assign<ComponentProps<E>, PolymorphicProps<E>>

type UIComponent<E extends ElementType> = (props: HTMLUIProps<E>) => JSX.Element

function withAsProp<T extends ElementType>(Component: T) {
  const UIComponent: UIComponent<T> = (props) => {
    const [localProps, parentProps] = splitProps(props, ['asChild'])

    if (localProps.asChild) {
      // @ts-expect-error -- Solid's generic splitProps result cannot express the polymorphic ref omission.
      const propsFn = (userProps) => {
        const [parentRefProps, restProps] = splitProps(parentProps, ['ref'])
        type ElementRef = Element | ((element: Element) => void) | undefined
        return mergeProps(restProps, userProps, {
          ref: composeRefs<Element>(
            parentRefProps.ref as unknown as ElementRef,
            userProps?.ref as unknown as ElementRef,
          ),
        })
      }
      return localProps.asChild(propsFn)
    }
    // @ts-expect-error -- Dynamic cannot infer the intrinsic element selected by this generic factory.
    return <Dynamic component={Component} {...parentProps} />
  }

  return UIComponent
}

function jsxFactory() {
  const cache = new Map()

  return new Proxy(withAsProp, {
    apply(_target, _thisArg, argArray) {
      return withAsProp(argArray[0])
    },
    get(_, element) {
      const asElement = element as ElementType
      if (!cache.has(asElement)) {
        cache.set(asElement, withAsProp(asElement))
      }
      return cache.get(asElement)
    },
  }) as unknown as JsxElements
}

export const ui = jsxFactory()
