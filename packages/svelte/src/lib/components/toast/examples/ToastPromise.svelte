<script lang="ts">
  import { Toast, Toaster, createToaster } from '../index'

  const toaster = createToaster({ placement: 'bottom-end' })

  const options = {
    loading: { title: loadingTitle, description: loadingDescription },
    success: { title: successTitle, description: successDescription },
    error: { title: errorTitle, description: errorDescription },
  }
</script>

{#snippet loadingTitle()}Loading...{/snippet}
{#snippet loadingDescription()}Please wait{/snippet}
{#snippet successTitle()}Success!{/snippet}
{#snippet successDescription()}Operation completed{/snippet}
{#snippet errorTitle()}Failed!{/snippet}
{#snippet errorDescription()}Something went wrong{/snippet}

<button
  type="button"
  onclick={() => toaster.promise(new Promise((resolve) => setTimeout(() => resolve('done'), 1000)), options)}
>
  Promise Success
</button>
<button
  type="button"
  onclick={() => toaster.promise(new Promise((_, reject) => setTimeout(() => reject(new Error('error')), 1000)), options)}
>
  Promise Error
</button>

<Toaster {toaster}>
  {#snippet children(toast)}
    <Toast.Root>
      <Toast.Title>{@render toast().title?.()}</Toast.Title>
      <Toast.Description>{@render toast().description?.()}</Toast.Description>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  {/snippet}
</Toaster>
