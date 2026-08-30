import { Avatar, useAvatar } from '@destyler-ui/solid/avatar'

export function RootProvider() {
  const avatar = useAvatar()

  return (
    <>
      <button onClick={() => avatar().setSrc('https://new-source.com')}>Change Source</button>

      <Avatar.RootProvider value={avatar}>
        <Avatar.Fallback>PA</Avatar.Fallback>
        <Avatar.Image src="https://i.pravatar.cc/300" alt="avatar" />
      </Avatar.RootProvider>
    </>
  )
}
