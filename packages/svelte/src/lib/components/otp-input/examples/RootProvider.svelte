<script lang="ts">
  import { OtpInput, useOtpInput } from '../index'

  const id = $props.id()
  const otpInput = useOtpInput({ id })
</script>

<button type="button" onclick={() => otpInput().focus()}>Focus</button>

<OtpInput.RootProvider value={otpInput}>
  <OtpInput.Label>Label</OtpInput.Label>
  <OtpInput.Control>
    {#each [0, 1, 2] as index (index)}
      <OtpInput.Input {index} />
    {/each}
  </OtpInput.Control>
  <OtpInput.HiddenInput />
</OtpInput.RootProvider>
