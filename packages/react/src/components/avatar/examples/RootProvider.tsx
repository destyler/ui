import { Avatar, useAvatar } from '../index'

export function RootProvider() {
  const avatar = useAvatar()

  return (
    <>
      <button onClick={() => avatar.setSrc('https://new-source.com')}>Change Source</button>

      <Avatar.RootProvider value={avatar}>
        <Avatar.Fallback>EL</Avatar.Fallback>
        <Avatar.Image src="https://github.com/elonehoo.png" alt="avatar" />
      </Avatar.RootProvider>
    </>
  )
}
