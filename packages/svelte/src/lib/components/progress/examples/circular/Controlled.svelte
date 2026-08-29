<script lang="ts">
  import { Progress } from '../../index'

  let value = $state<number | null>(42)
</script>

<Progress.Root bind:value>
  <Progress.Label>Label</Progress.Label>
  <Progress.ValueText />
  <Progress.Circle>
    <Progress.CircleTrack />
    <Progress.CircleRange />
  </Progress.Circle>
</Progress.Root>
