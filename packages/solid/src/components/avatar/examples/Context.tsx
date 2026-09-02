import { Avatar } from '@destyler-ui/solid/avatar'

export function Context() {
  return (
    <Avatar.Root>
      <Avatar.Context>
        {avatar => <Avatar.Fallback>{avatar().loaded ? 'PA' : 'Loading'}</Avatar.Fallback>}
      </Avatar.Context>
      <Avatar.Image src="https://i.pravatar.cc/300" alt="avatar" />
    </Avatar.Root>
  )
}
