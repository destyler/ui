import { Signature } from '../'

export function ComponentUnderTest(props: Signature.RootProps) {
  return (
    <Signature.Root {...props}>
      <Signature.Label>Sign below</Signature.Label>
      <Signature.Control>
        <Signature.Segment />
        <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
        <Signature.Guide />
      </Signature.Control>
    </Signature.Root>
  )
}
