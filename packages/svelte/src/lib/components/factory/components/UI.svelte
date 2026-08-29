<script lang="ts" generics="T extends keyof SvelteHTMLElements">
  import type { HTMLProps, PolymorphicProps, PropsFn } from '$lib/types'
  import { isVoidHTMLTag, isVoidSVGTag } from '$lib/utils/tags'
  import { mergeProps } from '@destyler/svelte'
  import { createAttachmentKey } from 'svelte/attachments'
  import type { SvelteHTMLElements } from 'svelte/elements'
  import Svg from './SvgFactory.svelte'

  type Props = HTMLProps<T> &
    PolymorphicProps<T> & {
      as: T
      ref?: Element | null
    }

  let { asChild, children, as, ref = $bindable<Element | null>(null), ...rest }: Props = $props()

  const refKey = createAttachmentKey()
  const refAttachment = (node: Element) => {
    ref = node
    return () => {
      if (ref === node)
        ref = null
    }
  }
  const propsFn: PropsFn<T> = (props) => {
    const childProps = props ?? {}
    const merged = mergeProps(rest, childProps) as Record<PropertyKey, unknown>

    for (const source of [rest, childProps] as Record<PropertyKey, unknown>[]) {
      for (const key of Object.getOwnPropertySymbols(source))
        merged[key] = source[key]
    }

    merged[refKey] = refAttachment
    return merged as HTMLProps<T>
  }
</script>

{#if asChild}
  {@render asChild?.(propsFn)}
{:else if isVoidSVGTag(as)}
  <Svg {as} {...rest} bind:ref />
{:else if isVoidHTMLTag(as)}
  <svelte:element this={as} {...rest} bind:this={ref} />
{:else if as === 'textarea'}
  <textarea {...rest} bind:this={ref}></textarea>
{:else}
  <svelte:element this={as} {...rest} bind:this={ref}>
    {@render children?.()}
  </svelte:element>
{/if}
