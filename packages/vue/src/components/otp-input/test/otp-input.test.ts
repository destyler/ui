import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { OtpInput, otpInputAnatomy } from '../index'

describe('[otp-input] component', () => {
  it.each(getParts(otpInputAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(otpInputAnatomy))('should export %s', async (part) => {
    expect(OtpInput[part]).toBeDefined()
  })
})
