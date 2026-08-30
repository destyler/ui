import type { UseOtpInputReturn } from './use-otp-input'
import { createContext } from '~/utils/create-context'

export interface UseOtpInputContext extends UseOtpInputReturn {}

const otpInputProviderTuple = createContext<UseOtpInputContext>({
  hookName: 'useOtpInputContext',
  providerName: '<OtpInputProvider />',
})

export const OtpInputProvider = otpInputProviderTuple[0]
export const useOtpInputContext = otpInputProviderTuple[1]
