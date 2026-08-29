<script lang="ts">
  import type { HTMLProps } from '$lib/types'
  import { createAttachmentKey } from 'svelte/attachments'
  import { UI } from '../index'

  let mounted = $state(true)
  let defaultRef = $state<Element | null>(null)
  let childRef = $state<Element | null>(null)
  let svgRef = $state<Element | null>(null)
  let inputRef = $state<Element | null>(null)
  let parentClicks = $state(0)
  let childClicks = $state(0)
  let childAttachmentRef = $state<Element | null>(null)

  const childAttachmentKey = createAttachmentKey()
  const childAttachment = (node: Element) => {
    childAttachmentRef = node
    return () => {
      if (childAttachmentRef === node)
        childAttachmentRef = null
    }
  }
  const childProps = {
    class: 'child-class',
    'data-testid': 'as-child',
    onclick: () => childClicks += 1,
    [childAttachmentKey]: childAttachment,
  } as HTMLProps<'button'>
</script>

{#if mounted}
  <UI
    as="button"
    type="button"
    class="default-class"
    data-testid="default"
    bind:ref={defaultRef}
  >
    Default content
  </UI>

  <UI
    as="button"
    type="button"
    class="parent-class"
    data-parent="present"
    onclick={() => parentClicks += 1}
    bind:ref={childRef}
  >
    {#snippet asChild(props)}
      <button {...props(childProps)}>
        Child content
      </button>
    {/snippet}
  </UI>

  <svg aria-label="factory svg">
    <UI as="circle" cx="5" cy="5" r="4" data-testid="circle" bind:ref={svgRef} />
  </svg>

  <UI as="input" aria-label="factory input" value="value" bind:ref={inputRef} />
{/if}

<output data-testid="default-ref">{defaultRef?.tagName ?? 'none'}</output>
<output data-testid="child-ref">{childRef?.tagName ?? 'none'}</output>
<output data-testid="child-attachment-ref">{childAttachmentRef?.tagName ?? 'none'}</output>
<output data-testid="svg-ref">{svgRef?.namespaceURI ?? 'none'}</output>
<output data-testid="input-ref">{inputRef?.tagName ?? 'none'}</output>
<output data-testid="parent-clicks">{parentClicks}</output>
<output data-testid="child-clicks">{childClicks}</output>
<button type="button" onclick={() => mounted = false}>Unmount factory nodes</button>
