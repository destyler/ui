import type { Component } from 'solid-js'
import { createEffect, createSignal, Match, onCleanup, onMount, Show, Switch } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { getFramework } from '../config/frameworks'
import { getExamplePreviewMessage } from '../utils/example-preview'
import { getActiveFramework, onFrameworkChange } from '../utils/framework'

interface Props {
  component: string
  example: string
}

type PreviewStatus = 'idle' | 'loading' | 'ready' | 'missing' | 'error'

const modules: Record<string, () => Promise<Record<string, Component>>> = import.meta.glob(
  '../../../packages/solid/src/components/*/examples/*.tsx',
)
const framework = getFramework('solid')

export default function SolidExample(props: Props) {
  const [isActive, setIsActive] = createSignal(false)
  const [status, setStatus] = createSignal<PreviewStatus>('idle')
  const [exampleComponent, setExampleComponent] = createSignal<Component | null>(null)
  let loadVersion = 0

  onMount(() => {
    setIsActive(getActiveFramework() === framework.id)
    onCleanup(onFrameworkChange(activeFramework => setIsActive(activeFramework === framework.id)))
  })

  createEffect(() => {
    const version = ++loadVersion
    if (!isActive()) {
      setExampleComponent(null)
      setStatus('idle')
      return
    }

    const key = `../../../packages/solid/src/components/${props.component}/examples/${props.example}.tsx`
    const loader = modules[key]
    if (!loader) {
      setExampleComponent(null)
      setStatus('missing')
      return
    }

    setExampleComponent(null)
    setStatus('loading')
    void loader().then((module) => {
      if (version !== loadVersion)
        return
      const loadedComponent = module[props.example] ?? module.default
      setExampleComponent(() => loadedComponent ?? null)
      setStatus(loadedComponent ? 'ready' : 'error')
    }).catch(() => {
      if (version === loadVersion) {
        setExampleComponent(null)
        setStatus('error')
      }
    })
  })

  return (
    <div class="ds-example-content">
      <Show when={status() !== 'idle'}>
        <Switch>
          <Match when={status() === 'ready' && exampleComponent()}>
            <Dynamic component={exampleComponent()!} />
          </Match>
          <Match when={status() !== 'ready'}>
            <div class={status() === 'loading' ? 'ds-preview-loading' : 'ds-preview-empty'}>
              {getExamplePreviewMessage(framework.label, status() as Exclude<PreviewStatus, 'idle' | 'ready'>)}
            </div>
          </Match>
        </Switch>
      </Show>
    </div>
  )
}
