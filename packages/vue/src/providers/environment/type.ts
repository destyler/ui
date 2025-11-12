export type RootNode = ShadowRoot | Document | Node

export interface UseEnvironmentContext {
  /**
   * The root node of the application.
   * This is used to determine the window and document objects.
   */
  getRootNode: () => RootNode
  /**
   * The document context for the root node.
   */
  getDocument: () => Document
  /**
   * The window context for the root node.
   */
  getWindow: () => Window & typeof globalThis
}

export interface EnvironmentProviderProps {
  value?: RootNode | (() => RootNode)
}
