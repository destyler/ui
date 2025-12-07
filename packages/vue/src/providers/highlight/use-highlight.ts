import { highlightWord } from '@destyler/highlight-text'
import { computed } from 'vue'
import { cleanProps } from '../../utils'

export interface HighlightChunk {
  text: string
  match: boolean
}

export interface HighlightSpan {
  start: number
  end: number
  match?: boolean
}

export interface UseHighlightProps {
  /**
   * The text to highlight
   */
  text: string
  /**
   * The query to highlight in the text
   */
  query: string | string[]
  /**
   * Whether to ignore case while matching
   */
  ignoreCase?: boolean
  /**
   * Whether to match multiple instances of the query
   */
  matchAll?: boolean
}

export function useHighlight(props: UseHighlightProps) {
  return computed(() => highlightWord(cleanProps(props)))
}
