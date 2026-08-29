<script lang="ts">
  import { onMount } from 'svelte'
  import { getFramework } from '../config/frameworks'
  import { getExamplePreviewMessage } from '../utils/example-preview'
  import { getActiveFramework, observeVisibility, onFrameworkChange } from '../utils/framework'

  interface Props {
    component: string
    example: string
  }

  const { component, example }: Props = $props()

  const modules: Record<string, () => Promise<any>> = import.meta.glob(
    '../../../packages/svelte/src/lib/components/*/examples/*.svelte',
  )

  const framework = getFramework('svelte')
  let isActive = $state(false)
  let isVisible = $state(false)
  let rootElement: HTMLDivElement

  onMount(() => {
    isActive = getActiveFramework() === framework.id
    const stopFrameworkListener = onFrameworkChange((activeFramework) => {
      isActive = activeFramework === framework.id
    })
    const visibilityTarget = rootElement.parentElement ?? rootElement
    const stopVisibilityObserver = observeVisibility(visibilityTarget, (visible) => {
      if (visible)
        isVisible = true
    })

    return () => {
      stopFrameworkListener()
      stopVisibilityObserver()
    }
  })

  const loader = $derived(
    isActive && isVisible
      ? modules[`../../../packages/svelte/src/lib/components/${component}/examples/${example}.svelte`]
      : undefined,
  )
</script>

<div bind:this={rootElement} class="ds-example-content">
  {#if isActive && isVisible && loader}
    {#await loader()}
      <div class="ds-preview-loading">{getExamplePreviewMessage(framework.label, 'loading')}</div>
    {:then module}
      {@const Example = module.default}
      <Example />
    {:catch}
      <div class="ds-preview-empty">{getExamplePreviewMessage(framework.label, 'error')}</div>
    {/await}
  {:else if isActive && isVisible}
    <div class="ds-preview-empty">{getExamplePreviewMessage(framework.label, 'missing')}</div>
  {/if}
</div>
