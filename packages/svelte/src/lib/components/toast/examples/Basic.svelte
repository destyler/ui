<script module lang="ts">
  export interface BasicProps {
    duration?: number
  }
</script>

<script lang="ts">
  import { Toast, Toaster, createToaster } from '../index'

  let { duration }: BasicProps = $props()

  const toaster = createToaster({ placement: 'bottom-end', overlap: true, gap: 24 })
</script>

{#snippet title()}Title{/snippet}
{#snippet description()}Description{/snippet}

<button type="button" onclick={() => toaster.create({ title, description, type: 'info', duration })}>Create Toast</button>

<Toaster {toaster}>
  {#snippet children(toast)}
    <Toast.Root>
      <Toast.Title>{@render toast().title?.()}</Toast.Title>
      <Toast.Description>{@render toast().description?.()}</Toast.Description>
      <Toast.ActionTrigger>Action</Toast.ActionTrigger>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  {/snippet}
</Toaster>
