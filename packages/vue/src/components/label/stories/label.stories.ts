import Basic from '../examples/Basic.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Label',
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

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
