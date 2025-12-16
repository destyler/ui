import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import Disabled from '../examples/Disabled.vue'
import InitialValue from '../examples/InitialValue.vue'
import RenderProp from '../examples/RenderProp.vue'
import RootProvider from '../examples/RootProvider.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / Switch',
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

export function renderProp() {
  return {
    components: { RenderProp },
    template: '<RenderProp />',
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
