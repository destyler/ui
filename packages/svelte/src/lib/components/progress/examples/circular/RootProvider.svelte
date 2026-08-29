<script lang="ts">
  import { Progress, useProgress } from '../../index'

  const id = $props.id()
  const progress = useProgress(() => ({ id, defaultValue: 42 }))
</script>

<button onclick={() => progress().setToMax()}>Set to MAX</button>
<Progress.RootProvider value={progress}>
  <Progress.Label>Label</Progress.Label>
  <Progress.ValueText />
  <Progress.Circle>
    <Progress.CircleTrack />
    <Progress.CircleRange />
  </Progress.Circle>
</Progress.RootProvider>
