import type { PropTypes } from '@destyler/solid'
import type { JSX } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps } from '@destyler/solid'
import * as toast from '@destyler/toast'

export interface CreateToasterProps extends Optional<Partial<toast.GroupMachineContext>, 'id'> {
  placement: toast.Placement
}

export interface CreateToasterReturn extends toast.GroupApi<PropTypes, JSX.Element> {
  machine: toast.GroupService<JSX.Element>
}

export interface ToasterInternal {
  groupElement: HTMLElement | null
  hotkeyRouting: boolean
  hotkeySelected: boolean
}

const serverRootNode = {
  nodeType: 9,
  visibilityState: 'visible',
  addEventListener() {},
  removeEventListener() {},
  getElementById() {
    return null
  },
} as unknown as Document

const toasterInternals = new WeakMap<CreateToasterReturn, ToasterInternal>()

function getDocumentRoot() {
  return typeof document === 'undefined' ? serverRootNode : document
}

function hasGetElementById(rootNode: Node): rootNode is Document | ShadowRoot {
  return typeof (rootNode as Document).getElementById === 'function'
}

function getIdRoot(rootNode: Document | ShadowRoot | Node): Document | ShadowRoot {
  if (hasGetElementById(rootNode))
    return rootNode

  const nestedRoot = rootNode.getRootNode?.()
  if (nestedRoot && hasGetElementById(nestedRoot))
    return nestedRoot

  return rootNode.ownerDocument ?? getDocumentRoot()
}

export function createToaster(props: CreateToasterProps): CreateToasterReturn {
  const internal: ToasterInternal = {
    groupElement: null,
    hotkeyRouting: false,
    hotkeySelected: false,
  }
  const groupId = `toast-group:${props.placement}`
  let scopedRoot: Document | ShadowRoot | Node | undefined
  let scopedTarget: Document | ShadowRoot | undefined

  const getRootNode = () => {
    const target = getIdRoot(
      internal.groupElement?.getRootNode()
      ?? props.getRootNode?.()
      ?? getDocumentRoot(),
    )
    if (target === scopedTarget && scopedRoot)
      return scopedRoot

    scopedTarget = target
    scopedRoot = new Proxy(target, {
      get(root, property) {
        if (property === 'getElementById') {
          return (id: string) => {
            if (id === groupId) {
              if (internal.hotkeyRouting && !internal.hotkeySelected)
                return null
              return internal.groupElement
            }
            return root.getElementById(id)
          }
        }

        const value = Reflect.get(root, property, root)
        return typeof value === 'function' ? value.bind(root) : value
      },
    })
    return scopedRoot
  }

  const machine = toast.group.machine<JSX.Element>({
    ...props,
    id: props.id ?? '1',
    getRootNode,
  })
  const api = toast.group.connect(machine, machine.send, normalizeProps)
  const toaster = { ...api, machine }
  toasterInternals.set(toaster, internal)
  return toaster
}

export function getToasterInternal(toaster: CreateToasterReturn) {
  const internal = toasterInternals.get(toaster)
  if (!internal)
    throw new Error('Invalid toaster instance')
  return internal
}
