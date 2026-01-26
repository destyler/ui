import { Avatar } from '../index'

export function Context() {
  return (
    <Avatar.Root>
      <Avatar.Context>
        {(avatar) => (
          <Avatar.Fallback>
            {avatar.loaded ? 'EL' : 'Loading'}
          </Avatar.Fallback>
        )}
      </Avatar.Context>
      <Avatar.Image src="https://github.com/elonehoo.png" alt="avatar" />
    </Avatar.Root>
  )
}
