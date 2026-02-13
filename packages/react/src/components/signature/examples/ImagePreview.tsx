'use client'

import type { DrawEndDetails } from '../index'
import { useState } from 'react'
import { Signature } from '../index'

export function ImagePreview() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleDrawEnd = async (details: DrawEndDetails) => {
    setImageUrl(await details.getDataUrl('image/png'))
  }

  return (
    <>
      <Signature.Root onDrawEnd={handleDrawEnd}>
        <Signature.Label>Sign below</Signature.Label>
        <Signature.Control>
          <Signature.Segment fill="orange" />
          <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
          <Signature.Guide />
        </Signature.Control>
      </Signature.Root>
      {imageUrl && <img src={imageUrl} alt="Signature preview" />}
    </>
  )
}
