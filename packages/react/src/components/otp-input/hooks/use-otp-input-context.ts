import type { UseOtpInputReturn } from './use-otp-input'
import { createContext } from '~/utils/create-context'

export interface UseOtpInputContext extends UseOtpInputReturn {}

export const [OtpInputProvider, useOtpInputContext] = createContext<UseOtpInputContext>({
  name: 'OtpInputContext',
  hookName: 'useOtpInputContext',
  providerName: '<OtpInputProvider />',
})
