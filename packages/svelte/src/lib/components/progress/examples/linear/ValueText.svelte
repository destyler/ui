<script lang="ts">
  import { Progress } from '../../index'
</script>

<Progress.Root
  translations={{
    value: ({ value, max }) => (value == null ? 'Loading...' : `${value} of ${max} items loaded`),
  }}
>
  <Progress.Label>Label</Progress.Label>
  <Progress.ValueText />
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>
