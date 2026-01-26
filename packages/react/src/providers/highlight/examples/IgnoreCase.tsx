import { Highlight } from '../index'

export function IgnoreCase() {
  return (
    <Highlight
      text="The quick brown Fox jumps over the lazy Dog."
      query={['fox', 'dog']}
      ignoreCase
    />
  )
}
