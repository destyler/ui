import type { UseOtpInputReturn } from './use-otp-input.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseOtpInputContext extends UseOtpInputReturn {}
export const [OtpInputProvider, useOtpInputContext] = createContext<UseOtpInputContext>({
  name: 'OtpInputContext',
})
