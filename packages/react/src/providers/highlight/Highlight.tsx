import type { UseHighlightProps } from './use-highlight'
import type { Assign } from '~/types'
import { Fragment } from 'react'
import { createSplitProps } from '~/utils/create-split-props'
import { useHighlight } from './use-highlight'

export interface HighlightBaseProps extends UseHighlightProps {}

export interface HighlightProps extends Assign<React.ComponentProps<'mark'>, HighlightBaseProps> {}

export function Highlight(props: HighlightProps) {
  if (typeof props.text !== 'string') {
    throw new TypeError('[destyler-ui/highlight] text must be a string')
  }

  const [highlightProps, localProps] = createSplitProps<HighlightBaseProps>()(props, [
    'query',
    'text',
    'ignoreCase',
    'matchAll',
  ])

  const chunks = useHighlight(highlightProps)

  return (
    <Fragment>
      {chunks.map(({ text, match }, i) =>
        match
          ? (
              <mark key={i} {...localProps}>
                {text}
              </mark>
            )
          : (
              <Fragment key={i}>{text}</Fragment>
            ),
      )}
    </Fragment>
  )
}
