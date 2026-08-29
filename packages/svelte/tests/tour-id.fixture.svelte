<script lang="ts">
  import { useTour } from '$lib'

  const { instance }: { instance: number } = $props()
  const id = $props.id()
  const tour = useTour({ id, steps: [] })
</script>

<output data-id-contract="tour" data-instance={instance} id={tour().getPositionerProps().id}></output>
