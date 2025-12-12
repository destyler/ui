import Basic from '../examples/Basic.vue'
import Blurred from '../examples/Blurred.vue'
import Customized from '../examples/Customized.vue'
import InitialValue from '../examples/InitialValue.vue'
import OtpMode from '../examples/OtpMode.vue'
import RootProvider from '../examples/RootProvider.vue'
import WithField from '../examples/WithField.vue'
import WithMask from '../examples/WithMask.vue'

export default {
  title: 'Components / Otp Input',
  parameters: {
    layout: 'fullscreen',
  },
}

export function basic() {
  return {
    components: { Basic },
    template: '<Basic />',
  }
}

export function blurred() {
  return {
    components: { Blurred },
    template: '<Blurred />',
  }
}

export function customized() {
  return {
    components: { Customized },
    template: '<Customized />',
  }
}

export function initialValue() {
  return {
    components: { InitialValue },
    template: '<InitialValue />',
  }
}

export function otpMode() {
  return {
    components: { OtpMode },
    template: '<OtpMode />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function withField() {
  return {
    components: { WithField },
    template: '<WithField />',
  }
}

export function withMask() {
  return {
    components: { WithMask },
    template: '<WithMask />',
  }
}
