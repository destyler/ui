import { Timer } from '@destyler-ui/solid/timer'

export function Countdown() {
  return (
    <Timer.Root autoStart countdown startMs={60 * 60 * 500}>
      <Timer.Area>
        <Timer.Item type="days" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="hours" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="minutes" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="seconds" />
      </Timer.Area>
    </Timer.Root>
  )
}
