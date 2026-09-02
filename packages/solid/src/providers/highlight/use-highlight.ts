import type { HighlightChunk, HighlightWordProps } from '@destyler/highlight-text'
import type { Accessor } from 'solid-js'
import { highlightWord } from '@destyler/highlight-text'
import { createMemo } from 'solid-js'

export interface UseHighlightProps extends HighlightWordProps {}

export function useHighlight(props: UseHighlightProps): Accessor<HighlightChunk[]> {
  return createMemo(() => highlightWord(props))
}

export type { HighlightChunk }
