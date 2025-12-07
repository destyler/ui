import autofocus from '../examples/Autofocus.vue'
import Basic from '../examples/Basic.vue'
import InitialFocus from '../examples/InitialFocus.vue'

export default {
  title: 'Components / Focus Trap',
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

export function autofocusExample() {
  return {
    components: { autofocus },
    template: '<autofocus />',
  }
}

export function initialFocus() {
  return {
    components: { InitialFocus },
    template: '<InitialFocus />',
  }
}
