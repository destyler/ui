<script lang="ts">
  import { useLabel } from '$lib'

  const { instance }: { instance: number } = $props()
  const id = $props.id()
  useLabel({ id })
</script>

<output data-id-contract="label" data-instance={instance} {id}></output>
