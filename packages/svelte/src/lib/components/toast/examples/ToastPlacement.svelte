<script lang="ts">
  import { Toast, Toaster, createToaster } from '../index'

  const toasterTopStart = createToaster({ placement: 'top-start' })
  const toasterBottomEnd = createToaster({ placement: 'bottom-end' })
</script>

{#snippet topTitle()}Top Start Toast{/snippet}
{#snippet topDescription()}This toast appears at top-start{/snippet}
{#snippet bottomTitle()}Bottom End Toast{/snippet}
{#snippet bottomDescription()}This toast appears at bottom-end{/snippet}

<button
  type="button"
  onclick={() => toasterTopStart.create({ title: topTitle, description: topDescription, type: 'info' })}
>
  Top Start
</button>
<button
  type="button"
  onclick={() => toasterBottomEnd.create({ title: bottomTitle, description: bottomDescription, type: 'info' })}
>
  Bottom End
</button>

<Toaster toaster={toasterTopStart}>
  {#snippet children(toast)}
    <Toast.Root>
      <Toast.Title>{@render toast().title?.()}</Toast.Title>
      <Toast.Description>{@render toast().description?.()}</Toast.Description>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  {/snippet}
</Toaster>

<Toaster toaster={toasterBottomEnd}>
  {#snippet children(toast)}
    <Toast.Root>
      <Toast.Title>{@render toast().title?.()}</Toast.Title>
      <Toast.Description>{@render toast().description?.()}</Toast.Description>
      <Toast.CloseTrigger>x</Toast.CloseTrigger>
    </Toast.Root>
  {/snippet}
</Toaster>
