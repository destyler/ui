import Basic from '../examples/Basic.vue'
import Portrait from '../examples/Portrait.vue'
import RootProvider from '../examples/RootProvider.vue'
import Square from '../examples/Square.vue'

export default {
  title: 'Components / Aspect Ratio',
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

export function square() {
  return {
    components: { Square },
    template: '<Square />',
  }
}

export function portrait() {
  return {
    components: { Portrait },
    template: '<Portrait />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
