type QueryRoot = Pick<Document, 'getElementById'>

export function resolveQueryRoot(rootNode: Node, fallbackDocument: Document): QueryRoot {
  if ('getElementById' in rootNode && typeof rootNode.getElementById === 'function')
    return rootNode as QueryRoot
  return rootNode.ownerDocument ?? fallbackDocument
}
