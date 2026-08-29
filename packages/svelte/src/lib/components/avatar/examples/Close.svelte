<script module lang="ts">
  import type { AvatarRootProps } from '../index'
  export interface Props extends AvatarRootProps { src?: string; name?: string }
</script>

<script lang="ts">
  import { Avatar } from '../index'
  let { src = 'https://github.com/elonehoo.png', name = 'Elone Hoo', ...props }: Props = $props()
  const initials = $derived(name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase())
</script>

<Avatar.Root {...props}>
  <Avatar.Fallback>{initials}</Avatar.Fallback>
  <Avatar.Image {src} alt={name} />
</Avatar.Root>
