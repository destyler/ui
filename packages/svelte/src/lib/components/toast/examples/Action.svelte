<script lang="ts">
  import { Toast, Toaster, createToaster } from '../index'

  const toaster = createToaster({ placement: 'bottom-end', gap: 24 })

  function addToast() {
    toaster.create({
      title,
      description,
      type: 'info',
      action: { label: 'Subscribe', onClick: () => console.log('Subscribe') },
    })
  }
</script>

{#snippet title()}Toast Title{/snippet}
{#snippet description()}Toast Description{/snippet}

<div>
  <button type="button" onclick={addToast}>Add Toast</button>

  <Toaster {toaster}>
    {#snippet children(toast)}
      <Toast.Root>
        <Toast.Title>{@render toast().title?.()}</Toast.Title>
        <Toast.Description>{@render toast().description?.()}</Toast.Description>
        {#if toast().action}
          <Toast.ActionTrigger>{toast().action?.label}</Toast.ActionTrigger>
        {/if}
      </Toast.Root>
    {/snippet}
  </Toaster>
</div>
