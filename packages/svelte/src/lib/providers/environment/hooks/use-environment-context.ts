import type { Accessor } from '$lib/types'
import { createContext } from '$lib/utils/create-context'

export type RootNode = ShadowRoot | Document | Node

export interface UseEnvironmentContext
  extends Accessor<{
    /**
     * The root node of the application.
     * This is used to determine the window and document objects.
     * @default document
     */
    getRootNode: () => RootNode
    /**
     * The document context for the root node.
     * @default document
     */
    getDocument: () => Document
    /**
     * The window context for the root node.
     * @default window
     */
    getWindow: () => Window & typeof globalThis
  }> {}

const serverDocument = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
} as unknown as Document

const serverWindow = { document: serverDocument } as Window & typeof globalThis

function getDefaultDocument() {
  return globalThis.document ?? serverDocument
}

function getDefaultWindow() {
  return globalThis.window ?? serverWindow
}

export const [EnvironmentContextProvider, useEnvironmentContext] = createContext<UseEnvironmentContext>({
  name: 'EnvironmentContext',
  strict: false,
  defaultValue: () => ({
    getRootNode: getDefaultDocument,
    getDocument: getDefaultDocument,
    getWindow: getDefaultWindow,
  }),
})
