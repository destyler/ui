import type { ComponentInternalInstance, ComponentPublicInstance, VNode } from 'vue'
import { computed, Fragment, getCurrentInstance, isVNode, onMounted, onScopeDispose, onUpdated, ref, triggerRef } from 'vue'

function isElement(el: unknown): el is Element {
  return typeof el === 'object' && el !== null && 'nodeType' in el && el.nodeType === 1
}

function getRootElement(vnode: VNode): unknown {
  if (vnode.component)
    return getRootElement(vnode.component.subTree)
  if (vnode.suspense?.activeBranch)
    return getRootElement(vnode.suspense.activeBranch)
  return vnode.el
}

function getElement(value: Element | ComponentPublicInstance | null | undefined): Element | undefined {
  let element: unknown = value
  if (value && !isElement(value)) {
    // Vue's ancestor $el aliases can lag behind root changes within Suspense.
    // Preserve a component's explicit exposed $el, otherwise read its live tree.
    const component = value.$
    element = component.exposed && '$el' in component.exposed
      ? value.$el
      : getRootElement(component.subTree)
  }
  if (isElement(element))
    return element

  // $el could be text/comment for non-single root normal or text root, thus we retrieve the nextElementSibling
  if (element && typeof element === 'object' && 'nodeType' in element
    && (element.nodeType === 3 || element.nodeType === 8)
    && 'nextElementSibling' in element && isElement(element.nextElementSibling)) {
    return element.nextElementSibling
  }
  return undefined
}

export function useForwardExpose() {
  const instance = getCurrentInstance()!

  const currentRef = ref<Element | ComponentPublicInstance | null>()
  const currentElement = computed(() => getElement(currentRef.value))

  const observedComponents = new WeakSet<ComponentInternalInstance>()
  let active = true
  onScopeDispose(() => {
    active = false
  })

  function observeRoot(vnode: VNode) {
    const component = vnode.component
    if (component) {
      if (!observedComponents.has(component)) {
        observedComponents.add(component)
        onMounted(refreshRoot, component)
        onUpdated(refreshRoot, component)
      }
      observeRoot(component.subTree)
    }
    else if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      vnode.children.filter(isVNode).forEach(observeRoot)
    }
    else if (vnode.suspense) {
      const { activeBranch, pendingBranch } = vnode.suspense
      if (activeBranch)
        observeRoot(activeBranch)
      // Resolving Suspense mounts the pending branch without updating ancestors.
      if (pendingBranch)
        observeRoot(pendingBranch)
    }
  }

  function refreshRoot() {
    if (!active)
      return

    const value = currentRef.value
    if (value && !isElement(value))
      observeRoot(value.$.vnode)

    // A child can replace its DOM root without changing its component ref or
    // updating its ancestors. Invalidate $el only after that child's render.
    if (getElement(value) !== currentElement.value)
      triggerRef(currentRef)
  }

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
    if (ref && !isElement(ref))
      observeRoot(ref.$.vnode)
  }

  return { forwardRef, currentRef, currentElement }
}
