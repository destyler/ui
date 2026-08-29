<script lang="ts">
  import { Toast, Toaster, createToaster } from '../index'

  const toaster = createToaster({ placement: 'bottom-end' })
  let actionTriggered = $state(false)

  function createToast() {
    actionTriggered = false
    toaster.create({ title, description, type: 'info' })
  }
</script>

{#snippet title()}File deleted{/snippet}
{#snippet description()}The file has been deleted{/snippet}

<button type="button" onclick={createToast}>Create Toast</button>
{#if actionTriggered}<div>Action triggered!</div>{/if}

<Toaster {toaster}>
  {#snippet children(toast)}
    <Toast.Root>
      <Toast.Title>{@render toast().title?.()}</Toast.Title>
      <Toast.Description>{@render toast().description?.()}</Toast.Description>
      <Toast.ActionTrigger onclick={() => (actionTriggered = true)}>Undo</Toast.ActionTrigger>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  {/snippet}
</Toaster>
