import type { JSX } from 'solid-js'
import type { UseOtpInputContext } from '../hooks/use-otp-input-context'
import { useOtpInputContext } from '../hooks/use-otp-input-context'

export interface OtpInputContextProps {
  children: (context: UseOtpInputContext) => JSX.Element
}

export const OtpInputContext = (props: OtpInputContextProps) => props.children(useOtpInputContext())
