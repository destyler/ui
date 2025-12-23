import type React from 'react'
import type { ComponentPropsWithoutRef, JSX } from 'react'
import { mergeProps } from '@destyler/xstate'
import {
  Children,
  cloneElement,

  createElement,
  forwardRef,
  isValidElement,

  memo,
} from 'react'
import { composeRefs } from '../utils/compose-refs'

export interface PolymorphicProps {
  /**
   * Use the provided child element as the default rendered element, combining their props and behavior.
   */
  asChild?: boolean
}

type JsxElements = { [E in keyof JSX.IntrinsicElements]: ForwardRefComponent<E> }
type ForwardRefComponent<E extends React.ElementType> = React.ForwardRefExoticComponent<PropsWithRef<E>>
type PropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E> & PolymorphicProps

// Credits to the Radix team
function getRef(element: React.ReactElement) {
  // React <=18 in DEV
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element as any).ref
  }

  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<unknown> }).ref
  }

  return (element.props as { ref?: React.Ref<unknown> }).ref || (element as any).ref
}

function withAsChild(Component: React.ElementType) {
  const Comp = memo(
    forwardRef<unknown, PropsWithRef<typeof Component>>((props, ref) => {
      const { asChild, children, ...restProps } = props

      if (!asChild) {
        return createElement(Component, { ...restProps, ref }, children)
      }

      const onlyChild: React.ReactNode = Children.only(children)

      if (!isValidElement<Record<string, unknown>>(onlyChild)) {
        return null
      }

      const childRef = getRef(onlyChild)

      return cloneElement(onlyChild, {
        ...mergeProps(restProps, onlyChild.props),
        ref: ref ? composeRefs(ref, childRef) : childRef,
      })
    }),
  )

  // @ts-expect-error - it exists
  Comp.displayName = Component.displayName || Component.name

  return Comp
}

export type HTMLProps<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>
export type HTMLUIProps<T extends keyof JSX.IntrinsicElements> = HTMLProps<T> & PolymorphicProps

export function jsxFactory() {
  const cache = new Map()

  return new Proxy(withAsChild, {
    apply(_target, _thisArg, argArray) {
      return withAsChild(argArray[0])
    },
    get(_, element) {
      const asElement = element as React.ElementType
      if (!cache.has(asElement)) {
        cache.set(asElement, withAsChild(asElement))
      }
      return cache.get(asElement)
    },
  }) as unknown as JsxElements
}

export const ui = jsxFactory()
