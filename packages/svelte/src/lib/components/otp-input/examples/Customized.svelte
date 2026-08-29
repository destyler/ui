<script lang="ts">
  import { OtpInput } from '../index'
</script>

<OtpInput.Root placeholder="*">
  <OtpInput.Label>Label</OtpInput.Label>
  <OtpInput.Control>
    {#each [0, 1, 2] as index (index)}
      <OtpInput.Input {index} />
    {/each}
  </OtpInput.Control>
  <OtpInput.HiddenInput />
</OtpInput.Root>
