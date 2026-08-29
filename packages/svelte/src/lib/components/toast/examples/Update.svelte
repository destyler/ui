<script lang="ts">
  import { Toast, Toaster, createToaster } from '../index'

  const toaster = createToaster({ placement: 'bottom-end', overlap: true, gap: 24 })
  let toastId: string | undefined

  function createToast() {
    toastId = toaster.create({ title: loadingTitle, description: loadingDescription, type: 'info' })
  }

  function updateToast() {
    if (toastId)
      toaster.update(toastId, { title: successTitle, description: successDescription })
  }
</script>

{#snippet loadingTitle()}Loading{/snippet}
{#snippet loadingDescription()}Loading ...{/snippet}
{#snippet successTitle()}Success{/snippet}
{#snippet successDescription()}Success!{/snippet}

<div>
  <button type="button" onclick={createToast}>Create Toast</button>
  <button type="button" onclick={updateToast}>Update Toast</button>

  <Toaster {toaster}>
    {#snippet children(toast)}
      <Toast.Root>
        <Toast.Title>{@render toast().title?.()}</Toast.Title>
        <Toast.Description>{@render toast().description?.()}</Toast.Description>
      </Toast.Root>
    {/snippet}
  </Toaster>
</div>
