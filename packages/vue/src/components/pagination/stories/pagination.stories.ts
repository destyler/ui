import Basic from '../examples/Basic.vue'
import Customized from '../examples/Customized.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Pagination',
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

export function customizedExample() {
  return {
    components: { Customized },
    template: '<Customized />',
  }
}
