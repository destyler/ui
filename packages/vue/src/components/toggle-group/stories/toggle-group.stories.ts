import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import InitialValue from '../examples/InitialValue.vue'
import Multiple from '../examples/Multiple.vue'
import RenderProp from '../examples/RenderProp.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Toggle Group',
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

export function initialValue() {
  return {
    components: { InitialValue },
    template: '<InitialValue />',
  }
}

export function multiple() {
  return {
    components: { Multiple },
    template: '<Multiple />',
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
