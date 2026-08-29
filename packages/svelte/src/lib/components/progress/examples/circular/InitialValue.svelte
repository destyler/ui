<script lang="ts">
  import { Progress } from '../../index'
</script>

<Progress.Root defaultValue={70}>
  <Progress.Label>Label</Progress.Label>
  <Progress.ValueText />
  <Progress.Circle>
    <Progress.CircleTrack />
    <Progress.CircleRange />
  </Progress.Circle>
</Progress.Root>
