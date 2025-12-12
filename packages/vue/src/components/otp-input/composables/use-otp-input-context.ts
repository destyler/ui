import type { UseOtpInputReturn } from './use-otp-input'
import { createContext } from '~/utils'

export interface UseOtpInputContext extends UseOtpInputReturn {}

export const [OtpInputProvider, useOtpInputContext] = createContext<UseOtpInputContext>('OtpInputContext')
