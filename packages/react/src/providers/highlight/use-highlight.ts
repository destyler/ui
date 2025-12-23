import type { HighlightChunk, HighlightWordProps } from '@destyler/highlight-text'
import { highlightWord } from '@destyler/highlight-text'
import { useMemo } from 'react'

export interface UseHighlightProps extends HighlightWordProps {}

export function useHighlight(props: UseHighlightProps): HighlightChunk[] {
  return useMemo(() => highlightWord(props), [props])
}

export type { HighlightChunk }
