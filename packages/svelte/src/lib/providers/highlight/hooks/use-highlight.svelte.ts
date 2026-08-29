import type { Accessor } from '$lib/types'
import type { HighlightChunk, HighlightWordProps } from '@destyler/highlight-text'
import type { MaybeFunction } from '@destyler/utils'
import { highlightWord } from '@destyler/highlight-text'
import { runIfFn } from '@destyler/utils'

export interface UseHighlightProps extends HighlightWordProps {}
export interface UseHighlightReturn extends Accessor<HighlightChunk[]> {}

export function useHighlight(props: MaybeFunction<UseHighlightProps>): UseHighlightReturn {
  const chunks = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return highlightWord(resolvedProps)
  })
  return () => chunks
}

export type { HighlightChunk }
