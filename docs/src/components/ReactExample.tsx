import type { ComponentType } from 'react'
import { useEffect, useRef, useState } from 'react'
import { getFramework } from '../config/frameworks'
import { getExamplePreviewMessage } from '../utils/example-preview'
import { getActiveFramework, observeVisibility, onFrameworkChange } from '../utils/framework'

interface Props {
  component: string
  example: string
}

const modules: Record<string, () => Promise<any>> = import.meta.glob(
  '../../../packages/react/src/components/*/examples/*.tsx',
)
const framework = getFramework('react')

export default function ReactExample({ component, example }: Props) {
  const [isActive, setIsActive] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'missing' | 'error'>('idle')
  const [Component, setComponent] = useState<ComponentType<any> | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsActive(getActiveFramework() === framework.id)
    return onFrameworkChange(activeFramework => setIsActive(activeFramework === framework.id))
  }, [])

  useEffect(() => {
    if (!rootRef.current)
      return
    const visibilityTarget = rootRef.current.parentElement ?? rootRef.current
    return observeVisibility(visibilityTarget, (visible) => {
      if (visible)
        setIsVisible(true)
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!isActive || !isVisible) {
      setComponent(null)
      setStatus('idle')
      return () => {
        cancelled = true
      }
    }
    const key = `../../../packages/react/src/components/${component}/examples/${example}.tsx`
    const loader = modules[key]
    if (!loader) {
      setComponent(null)
      setStatus('missing')
      return () => {
        cancelled = true
      }
    }

    setComponent(null)
    setStatus('loading')
    loader().then((mod) => {
      if (cancelled)
        return
      const LoadedComponent = mod[example] || mod.default
      setComponent(() => LoadedComponent ?? null)
      setStatus(LoadedComponent ? 'ready' : 'error')
    }).catch(() => {
      if (!cancelled) {
        setComponent(null)
        setStatus('error')
      }
    })

    return () => {
      cancelled = true
    }
  }, [component, example, isActive, isVisible])

  return (
    <div ref={rootRef} className="ds-example-content">
      {status === 'ready' && Component && <Component />}
      {status !== 'idle' && status !== 'ready' && (
        <div className={status === 'loading' ? 'ds-preview-loading' : 'ds-preview-empty'}>
          {getExamplePreviewMessage(framework.label, status)}
        </div>
      )}
    </div>
  )
}
