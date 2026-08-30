import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export type RootNode = ShadowRoot | Document | Node

export interface UseEnvironmentContext {
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
}

const environmentContextProviderTuple = createContext<
  Accessor<UseEnvironmentContext>
>({
  hookName: 'useEnvironmentContext',
  providerName: '<EnvironmentProvider />',
  strict: false,
  defaultValue: () => ({
    getRootNode: () => document,
    getDocument: () => document,
    getWindow: () => window,
  }),
})

export const EnvironmentContextProvider = environmentContextProviderTuple[0]
export const useEnvironmentContext = environmentContextProviderTuple[1]
