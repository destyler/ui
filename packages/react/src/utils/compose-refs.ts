type PossibleRef<T> = React.Ref<T | null> | undefined

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    return ref(value)
  }
  else if (ref !== null && ref !== undefined) {
    ;(ref as React.RefObject<T>).current = value
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T | null) => void | (() => void) {
  return (node) => {
    const cleanups = refs.map(ref => setRef(ref, node))
    // React 19 invokes the returned cleanup instead of calling the ref with null.
    // Preserve React 18's null callback path when every ref uses that contract.
    if (cleanups.some(cleanup => typeof cleanup === 'function')) {
      return () => {
        cleanups.forEach((cleanup, index) => {
          if (typeof cleanup === 'function')
            cleanup()
          else
            setRef(refs[index], null)
        })
      }
    }
  }
}
