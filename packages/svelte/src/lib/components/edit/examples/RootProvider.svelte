<script lang="ts">
  import { Edit, useEdit } from '../index'

  const id = $props.id()
  const editable = useEdit({ id, placeholder: 'Placeholder' })
</script>

<button type="button" onclick={() => editable().edit()}>Edit from API</button>
<Edit.RootProvider value={editable}>
  <Edit.Label>Label</Edit.Label>
  <Edit.Area>
    <Edit.Input />
    <Edit.Preview />
  </Edit.Area>
</Edit.RootProvider>
