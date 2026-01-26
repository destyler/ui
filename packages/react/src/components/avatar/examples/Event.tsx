import { Avatar } from '../index'

export function Event() {
  return (
    <Avatar.Root onStatusChange={(e) => console.log(e.status)}>
      <Avatar.Fallback>EL</Avatar.Fallback>
      <Avatar.Image src="https://github.com/elonehoo.png" alt="avatar" />
    </Avatar.Root>
  )
}
