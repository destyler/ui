import Basic from '../examples/Basic.vue'
import RenderFn from '../examples/RenderFn.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Clipboard',
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

export function renderFn() {
  return {
    components: { RenderFn },
    template: '<RenderFn />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
