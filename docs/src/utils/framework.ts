import type { Framework } from '../config/frameworks'
import { defaultFramework, isFramework } from '../config/frameworks'

export const frameworkStorageKey = 'destyler-framework'
export const frameworkChangeEvent = 'destyler:framework-change'

export function getActiveFramework(): Framework {
  if (typeof document === 'undefined')
    return defaultFramework

  const framework = document.documentElement.dataset.framework
  return isFramework(framework) ? framework : getStoredFramework()
}

export function getStoredFramework(): Framework {
  if (typeof localStorage === 'undefined')
    return defaultFramework

  const framework = localStorage.getItem(frameworkStorageKey)
  return isFramework(framework) ? framework : defaultFramework
}

export function setActiveFramework(framework: Framework): void {
  document.documentElement.dataset.framework = framework
  localStorage.setItem(frameworkStorageKey, framework)
  window.dispatchEvent(new CustomEvent<Framework>(frameworkChangeEvent, { detail: framework }))
}

export function onFrameworkChange(listener: (framework: Framework) => void): () => void {
  const handleChange = (event: Event) => {
    listener((event as CustomEvent<Framework>).detail)
  }

  window.addEventListener(frameworkChangeEvent, handleChange)
  return () => window.removeEventListener(frameworkChangeEvent, handleChange)
}

export function observeVisibility(element: Element, listener: (visible: boolean) => void): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    listener(true)
    return () => {}
  }

  const observer = new IntersectionObserver((entries) => {
    listener(entries.some(entry => entry.isIntersecting))
  }, { rootMargin: '200px' })

  observer.observe(element)
  return () => observer.disconnect()
}
