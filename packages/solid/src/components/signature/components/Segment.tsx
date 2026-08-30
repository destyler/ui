import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { For, Show } from 'solid-js'
import { ui } from '~/factory'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureSegmentBaseProps extends PolymorphicProps<'svg'> {}
export interface SignatureSegmentProps extends HTMLProps<'svg'>, SignatureSegmentBaseProps {}

export function SignatureSegment(props: SignatureSegmentProps) {
  const signature = useSignatureContext()
  const mergedProps = mergeProps(() => signature().getSegmentProps(), props)

  return (
    <ui.svg {...mergedProps}>
      <title>Signature</title>
      <For each={signature().paths}>
        {path => <path {...signature().getSegmentPathProps({ path })} />}
      </For>
      <Show when={signature().currentPath}>
        {/* @ts-expect-error -- Show narrows the accessor value at runtime but not inside this callback. */}
        <path {...signature().getSegmentPathProps({ path: signature().currentPath })} />
      </Show>
    </ui.svg>
  )
}
