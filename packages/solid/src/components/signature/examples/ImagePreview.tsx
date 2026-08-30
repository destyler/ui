import { Signature } from '@destyler-ui/solid/signature'
import { createSignal, Show } from 'solid-js'

export function ImagePreview() {
  const [imageUrl, setImageUrl] = createSignal<string>()

  return (
    <>
      <Signature.Root
        onDrawEnd={details => details.getDataUrl('image/png').then(url => setImageUrl(url))}
      >
        <Signature.Label>Sign below</Signature.Label>
        <Signature.Control>
          <Signature.Segment fill="orange" />
          <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
          <Signature.Guide />
        </Signature.Control>
      </Signature.Root>
      <Show when={imageUrl()}>
        <img src={imageUrl()} alt="Signature" />
      </Show>
    </>
  )
}
