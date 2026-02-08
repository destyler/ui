import type { ReactNode } from 'react'
import type { UseOtpInputContext } from '../hooks/use-otp-input-context'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputContextProps {
  children: (context: UseOtpInputContext) => ReactNode
}

export const OtpInputContext = (props: OtpInputContextProps) => props.children(useOtpInputContext())
