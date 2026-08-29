<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseSignatureContext } from '../hooks/use-signature-context'

  export interface SignatureContextProps {
    render: Snippet<[UseSignatureContext]>
  }
</script>

<script lang="ts">
  import { useSignatureContext } from '../hooks/use-signature-context'

  let { render }: SignatureContextProps = $props()

  const signatureContext = useSignatureContext()
</script>

{@render render(signatureContext)}
