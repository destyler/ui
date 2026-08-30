import { Avatar } from '@destyler-ui/solid/avatar'

export function Basic() {
  return (
    <Avatar.Root>
      <Avatar.Fallback>PA</Avatar.Fallback>
      <Avatar.Image src="https://i.pravatar.cc/300" alt="avatar" />
    </Avatar.Root>
  )
}
