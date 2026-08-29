<script lang="ts">
  import { Avatar } from '../index'
  let { src = 'https://github.com/elonehoo.png' }: { src?: string } = $props()
  let status = $state('loading...')
</script>

<div class="stack">
  <output>Status: {status}</output>
  <Avatar.Root onStatusChange={(event) => status = event.status}>
    <Avatar.Fallback>EL</Avatar.Fallback>
    <Avatar.Image {src} alt="avatar" />
  </Avatar.Root>
</div>
