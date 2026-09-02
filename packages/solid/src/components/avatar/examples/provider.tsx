import { Avatar, useAvatar } from '@destyler-ui/solid/avatar'

export function Provider() {
  const avatar = useAvatar({
    onStatusChange: e => console.warn('status changed', e),
  })

  return (
    <Avatar.RootProvider value={avatar}>
      <Avatar.Fallback>PA</Avatar.Fallback>
      <Avatar.Image src="https://i.pravatar.cc/300" alt="avatar" />
    </Avatar.RootProvider>
  )
}
