import { type ComponentType, type LazyExoticComponent, Suspense, lazy, useMemo } from 'react'

interface Props {
  component: string
  example: string
}

const modules: Record<string, () => Promise<any>> = import.meta.glob(
  '../../../packages/react/src/components/*/examples/*.tsx',
)

export default function ReactExample({ component, example }: Props) {
  const Component: LazyExoticComponent<ComponentType<any>> | null = useMemo(() => {
    const key = `../../../packages/react/src/components/${component}/examples/${example}.tsx`
    const loader = modules[key]
    if (!loader)
      return null
    return lazy(async () => {
      const mod = await loader()
      // React examples use named exports matching the filename
      const Comp = mod[example] || mod.default
      return { default: Comp }
    })
  }, [component, example])

  if (!Component) {
    return <div className="ds-preview-empty">React example not found</div>
  }

  return (
    <div className="ds-react-example">
      <Suspense fallback={<div className="ds-preview-loading">Loading…</div>}>
        <Component />
      </Suspense>
    </div>
  )
}
