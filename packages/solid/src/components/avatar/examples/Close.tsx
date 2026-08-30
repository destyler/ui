import { createMemo, mergeProps, splitProps } from 'solid-js'
import { Avatar } from '../index'

export interface CloseProps extends Avatar.RootProps {
  name?: string
  src?: string
}

export function Close(props: CloseProps) {
  const mergedProps = mergeProps(
    { src: 'https://github.com/elonehoo.png', name: 'Elone Hoo' },
    props,
  )
  const [localProps, rootProps] = splitProps(mergedProps, ['name', 'src'])
  const initials = createMemo(() =>
    localProps.name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  )

  return (
    <Avatar.Root {...rootProps}>
      <Avatar.Fallback>{initials()}</Avatar.Fallback>
      <Avatar.Image src={localProps.src} alt={localProps.name} />
    </Avatar.Root>
  )
}
