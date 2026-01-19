import { Avatar } from '../index'

export function Basic(props: Avatar.RootProps) {
  return (
    <Avatar.Root {...props}>
      <Avatar.Fallback>EH</Avatar.Fallback>
      <Avatar.Image src="https://github.com/elonehoo.png" alt="avatar" />
    </Avatar.Root>
  )
}
