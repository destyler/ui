import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import ErrorCorrection from '../examples/ErrorCorrection.vue'
import RootProvider from '../examples/RootProvider.vue'
import WithOverlay from '../examples/WithOverlay.vue'

export default {
  title: 'Components / Qr Code',
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

export function controlled() {
  return {
    components: { Controlled },
    template: '<Controlled />',
  }
}

export function errorCorrection() {
  return {
    components: { ErrorCorrection },
    template: '<ErrorCorrection />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function withOverlay() {
  return {
    components: { WithOverlay },
    template: '<WithOverlay />',
  }
}
