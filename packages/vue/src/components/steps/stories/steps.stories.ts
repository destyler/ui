import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import InitialStep from '../examples/InitialStep.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Steps',
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

export function initialStep() {
  return {
    components: { InitialStep },
    template: '<InitialStep />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
