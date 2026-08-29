<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseOtpInputContext } from '../hooks/use-otp-input-context'

  export interface OtpInputContextProps {
    render?: Snippet<[UseOtpInputContext]>
  }
</script>

<script lang="ts">
  import { useOtpInputContext } from '../hooks/use-otp-input-context'

  const { render }: OtpInputContextProps = $props()

  const context = useOtpInputContext()
</script>

{@render render?.(context)}
