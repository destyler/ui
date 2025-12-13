import Basic from '../examples/Basic.vue'
import Disabled from '../examples/Disabled.vue'
import InitialValue from '../examples/InitialValue.vue'
import OnEvent from '../examples/OnEvent.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Radio',
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

export function disabled() {
  return {
    components: { Disabled },
    template: '<Disabled />',
  }
}

export function initialValue() {
  return {
    components: { InitialValue },
    template: '<InitialValue />',
  }
}

export function onEvent() {
  return {
    components: { OnEvent },
    template: '<OnEvent />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
