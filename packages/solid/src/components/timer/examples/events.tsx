import { Timer } from '@destyler-ui/solid/timer'

export function Events() {
  return (
    <Timer.Root
      targetMs={5 * 1000}
      onComplete={() => console.warn('Timer completed')}
      onTick={details => console.warn('Tick:', details.formattedTime)}
    >
      <Timer.Item type="seconds" />
    </Timer.Root>
  )
}
