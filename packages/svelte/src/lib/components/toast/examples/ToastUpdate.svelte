<script lang="ts">
  import { Toast, Toaster, createToaster } from '../index'

  const toaster = createToaster({ placement: 'bottom-end' })
  let toastId: string | undefined

  function createToast() {
    toastId = toaster.create({ title: originalTitle, description: originalDescription, type: 'info' })
  }

  function updateToast() {
    if (toastId)
      toaster.update(toastId, { title: updatedTitle, description: updatedDescription, type: 'success' })
  }
</script>

{#snippet originalTitle()}Original Title{/snippet}
{#snippet originalDescription()}Original Description{/snippet}
{#snippet updatedTitle()}Updated Title{/snippet}
{#snippet updatedDescription()}Updated Description{/snippet}

<button type="button" onclick={createToast}>Create Toast</button>
<button type="button" onclick={updateToast}>Update Toast</button>

<Toaster {toaster}>
  {#snippet children(toast)}
    <Toast.Root>
      <Toast.Title>{@render toast().title?.()}</Toast.Title>
      <Toast.Description>{@render toast().description?.()}</Toast.Description>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  {/snippet}
</Toaster>
