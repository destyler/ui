<script module lang="ts">
  export interface ControlledProps {
    activationMode?: 'focus' | 'click' | 'dblclick'
    placeholder?: string
  }
</script>

<script lang="ts">
  import { Edit } from '../index'

  let { activationMode = 'click', placeholder = 'Placeholder' }: ControlledProps = $props()
  let value = $state('')
</script>

<Edit.Root {activationMode} {placeholder} bind:value>
  <Edit.Label>Label</Edit.Label>
  <Edit.Area>
    <Edit.Input aria-label="editable input" />
    <Edit.Preview />
  </Edit.Area>
  <Edit.Context>
    {#snippet render(edit)}
      {#if edit().editing}
        <Edit.Control>
          <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
          <Edit.CancelTrigger aria-label="cancel">Cancel</Edit.CancelTrigger>
        </Edit.Control>
      {:else}
        <Edit.Control>
          <Edit.EditTrigger>Edit</Edit.EditTrigger>
        </Edit.Control>
      {/if}
    {/snippet}
  </Edit.Context>
</Edit.Root>
