'use client'

import type { DrawEndDetails } from '../index'
import { useState } from 'react'
import { Field } from '~/components/field'
import { Signature } from '../index'

export function WithField(props: Field.RootProps) {
  const [imageUrl, setImageUrl] = useState('')

  const handleDrawEnd = async (details: DrawEndDetails) => {
    setImageUrl(await details.getDataUrl('image/png'))
  }

  return (
    <Field.Root {...props}>
      <Signature.Root onDrawEnd={handleDrawEnd}>
        <Signature.Label>Label</Signature.Label>
        <Signature.Control>
          <Signature.Segment />
          <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
          <Signature.Guide />
        </Signature.Control>
        <Signature.HiddenInput value={imageUrl} />
      </Signature.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
