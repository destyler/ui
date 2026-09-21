<script lang="ts">
  import { OtpInput } from '../index'

  let value = $state(['1', '2', '3'])
</script>

<output>{value.join('')}</output>
<OtpInput.Root bind:value>
  <OtpInput.Label>Label</OtpInput.Label>
  <OtpInput.Control>
    {#each [0, 1, 2] as index (index)}
      <OtpInput.Input {index} />
    {/each}
  </OtpInput.Control>
  <OtpInput.HiddenInput />
</OtpInput.Root>
