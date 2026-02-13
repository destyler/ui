'use client'

import { Signature, useSignature } from '../index'

export function RootProvider() {
  const signature = useSignature()

  return (
    <>
      <button onClick={() => signature.clear()}>Clear</button>
      <Signature.RootProvider value={signature}>
        <Signature.Label>Sign below</Signature.Label>
        <Signature.Control>
          <Signature.Segment />
          <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
          <Signature.Guide />
        </Signature.Control>
      </Signature.RootProvider>
    </>
  )
}
