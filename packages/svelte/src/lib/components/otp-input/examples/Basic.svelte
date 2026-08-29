<script module lang="ts">
  import type { OtpInputRootProps } from '../index'

  export interface BasicProps extends OtpInputRootProps {}
</script>

<script lang="ts">
  import { OtpInput } from '../index'

  const props: BasicProps = $props()
</script>

<OtpInput.Root {...props}>
  <OtpInput.Label>Label</OtpInput.Label>
  <OtpInput.Control>
    {#each [0, 1, 2] as index (index)}
      <OtpInput.Input {index} />
    {/each}
  </OtpInput.Control>
  <OtpInput.HiddenInput />
</OtpInput.Root>
