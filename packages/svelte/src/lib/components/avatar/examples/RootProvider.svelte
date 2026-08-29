<script lang="ts">
  import { Avatar, useAvatar } from '../index'
  const id = $props.id()
  const avatar = useAvatar({ id })
  let count = $state(0)
</script>

<div class="stack">
  <button type="button" onclick={() => count++}>Change Source</button>
  <Avatar.RootProvider value={avatar}>
    <Avatar.Fallback>EL</Avatar.Fallback>
    <Avatar.Image src={`https://cover.sli.dev?u=${count}`} alt="avatar" />
  </Avatar.RootProvider>
</div>
