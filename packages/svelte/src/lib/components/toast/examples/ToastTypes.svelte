<script module lang="ts">
  export interface ToastTypesProps {
    duration?: number
  }
</script>

<script lang="ts">
  import { Toast, Toaster, createToaster } from '../index'

  let { duration }: ToastTypesProps = $props()

  const toaster = createToaster({ placement: 'bottom-end' })
</script>

{#snippet successTitle()}Success Toast{/snippet}
{#snippet successDescription()}Operation completed successfully{/snippet}
{#snippet errorTitle()}Error Toast{/snippet}
{#snippet errorDescription()}Something went wrong{/snippet}
{#snippet loadingTitle()}Loading Toast{/snippet}
{#snippet loadingDescription()}Please wait...{/snippet}
{#snippet infoTitle()}Info Toast{/snippet}
{#snippet infoDescription()}Here is some information{/snippet}

<button type="button" onclick={() => toaster.success({ title: successTitle, description: successDescription, duration })}>
  Success
</button>
<button type="button" onclick={() => toaster.error({ title: errorTitle, description: errorDescription, duration })}>Error</button>
<button type="button" onclick={() => toaster.loading({ title: loadingTitle, description: loadingDescription, duration })}>
  Loading
</button>
<button type="button" onclick={() => toaster.create({ title: infoTitle, description: infoDescription, type: 'info', duration })}>
  Info
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
