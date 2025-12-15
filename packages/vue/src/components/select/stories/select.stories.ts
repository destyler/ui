import Advanced from '../examples/Advanced.vue'
import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import Multiple from '../examples/Multiple.vue'
import ReactiveCollection from '../examples/ReactiveCollection.vue'
import RootProvider from '../examples/RootProvider.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / Select',
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

export function multiple() {
  return {
    components: { Multiple },
    template: '<Multiple />',
  }
}

export function advanced() {
  return {
    components: { Advanced },
    template: '<Advanced />',
  }
}

export function reactiveCollection() {
  return {
    components: { ReactiveCollection },
    template: '<ReactiveCollection />',
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
