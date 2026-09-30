import type { ComponentPublicInstance } from 'vue'
import { computed, getCurrentInstance, ref } from 'vue'

function isElement(el: unknown): el is Element {
  return typeof el === 'object' && el !== null && 'nodeType' in el && el.nodeType === 1
}

export function useForwardExpose() {
  const instance = getCurrentInstance()!

  const currentRef = ref<Element | ComponentPublicInstance | null>()

  const currentElement = computed<Element | undefined>(() => {
    const value = currentRef.value
    const element: unknown = isElement(value) ? value : value?.$el
    if (isElement(element))
      return element

    // $el could be text/comment for non-single root normal or text root, thus we retrieve the nextElementSibling
    if (element && typeof element === 'object' && 'nodeType' in element
      && (element.nodeType === 3 || element.nodeType === 8)
      && 'nextElementSibling' in element && isElement(element.nextElementSibling)) {
      return element.nextElementSibling
    }
    return undefined
  })

  // localExpose should only be assigned once else will create infinite loop
  const localExpose: Record<string, any> | null = Object.assign({}, instance.exposed)
  const ret: Record<string, any> = {}

  // retrieve props for current instance
  for (const key in instance.props) {
    Object.defineProperty(ret, key, {
      enumerable: true,
      configurable: true,
      get: () => instance.props[key],
    })
  }

  // retrieve default exposed value
  if (Object.keys(localExpose).length > 0) {
    for (const key in localExpose) {
      Object.defineProperty(ret, key, {
        enumerable: true,
        configurable: true,
        get: () => localExpose![key],
      })
    }
  }

  // retrieve original first root element
  Object.defineProperty(ret, '$el', {
    enumerable: true,
    configurable: true,
    get: () => currentElement.value ?? instance.vnode.el,
  })

  instance.exposed = ret

  function forwardRef(ref: Element | ComponentPublicInstance | null) {
    currentRef.value = ref
  }

  return { forwardRef, currentRef, currentElement }
}
