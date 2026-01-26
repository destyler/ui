import { Highlight } from '../index'

export function MatchAll() {
  return (
    <div>
      <h3>Match All</h3>
      <Highlight text="The quick brown fox jumps over the lazy fox." query="fox" matchAll />

      <h3>Match First Occurrence Only</h3>
      <Highlight text="The quick brown fox jumps over the lazy fox." query="fox" matchAll={false} />
    </div>
  )
}
