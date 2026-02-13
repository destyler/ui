import { Signature } from '../index'

export function Basic() {
  return (
    <Signature.Root>
      <Signature.Label>Sign below</Signature.Label>
      <Signature.Control>
        <Signature.Segment />
        <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
        <Signature.Guide />
      </Signature.Control>
    </Signature.Root>
  )
}
