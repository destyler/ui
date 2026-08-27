import { Avatar } from '../index'

export interface CloseProps extends Avatar.RootProps {
  src?: string
  name: string
}

export function Close(props: CloseProps) {
  const { src = 'https://github.com/elonehoo.png', name = 'Elone Hoo', ...rootProps } = props

  const getInitials = name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Avatar.Root {...rootProps}>
      <Avatar.Fallback>{getInitials}</Avatar.Fallback>
      <Avatar.Image src={src} alt={name} />
    </Avatar.Root>
  )
}
