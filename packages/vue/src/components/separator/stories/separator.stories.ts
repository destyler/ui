import Basic from '../examples/Basic.vue'
import RootProvider from '../examples/RootProvider.vue'
import Vertical from '../examples/Vertical.vue'

export default {
  title: 'Components / Separator',
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

export function vertical() {
  return {
    components: { Vertical },
    template: '<Vertical />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
