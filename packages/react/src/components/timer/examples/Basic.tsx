import { Timer } from '../index'

export function Basic() {
  return (
    <Timer.Root countdown autoStart startMs={60000}>
      <Timer.Area>
        <Timer.Item type="days" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="hours" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="minutes" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="seconds" />
      </Timer.Area>
      <Timer.Control>
        <Timer.ActionTrigger action="start">START</Timer.ActionTrigger>
        <Timer.ActionTrigger action="pause">PAUSE</Timer.ActionTrigger>
        <Timer.ActionTrigger action="resume">RESUME</Timer.ActionTrigger>
        <Timer.ActionTrigger action="reset">RESET</Timer.ActionTrigger>
      </Timer.Control>
    </Timer.Root>
  )
}
