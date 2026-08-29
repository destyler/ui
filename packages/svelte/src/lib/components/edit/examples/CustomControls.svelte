<script lang="ts">
  import { Edit } from '../index'
</script>

<Edit.Root placeholder="Placeholder">
  <Edit.Label>Label</Edit.Label>
  <Edit.Area>
    <Edit.Input />
    <Edit.Preview />
  </Edit.Area>
  <Edit.Context>
    {#snippet render(edit)}
      {#if edit().editing}
        <Edit.Control>
          <Edit.SubmitTrigger>Save</Edit.SubmitTrigger>
          <Edit.CancelTrigger>Cancel</Edit.CancelTrigger>
        </Edit.Control>
      {:else}
        <Edit.Control>
          <Edit.EditTrigger>Edit</Edit.EditTrigger>
        </Edit.Control>
      {/if}
    {/snippet}
  </Edit.Context>
</Edit.Root>
