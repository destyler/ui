import type { PropTypes } from '@destyler/react'
import type * as aspectRatio from '@destyler/aspect-ratio'
import type { ReactNode } from 'react'
import type { HTMLUIProps } from '~/factory'
import type { Optional } from '~/types'

export type UseAspectRatioProps = Optional<Omit<aspectRatio.Context, 'id' | 'getRootNode'>, 'id'>
export type UseAspectRatioReturn = aspectRatio.Api<PropTypes>

export interface RootProps extends HTMLUIProps<'div'>, UseAspectRatioProps {}

export interface ContentProps extends HTMLUIProps<'div'> {}

export interface ContextProps {
  children: (context: UseAspectRatioReturn) => ReactNode
}

export interface RootProviderProps extends HTMLUIProps<'div'> {
  value: UseAspectRatioReturn
}
