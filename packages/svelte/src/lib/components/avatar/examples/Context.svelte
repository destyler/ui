<script lang="ts">
  import { Avatar } from '../index'
</script>

<Avatar.Root>
  <Avatar.Context>
    {#snippet api(avatar)}
      <Avatar.Fallback>{avatar().loaded ? 'EL' : 'Loading'}</Avatar.Fallback>
    {/snippet}
  </Avatar.Context>
  <Avatar.Image src="https://github.com/elonehoo.png" alt="avatar" />
</Avatar.Root>
