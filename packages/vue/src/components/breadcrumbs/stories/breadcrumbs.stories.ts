import Basic from '../examples/Basic.vue'
import Context from '../examples/Context.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Breadcrumbs',
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

export function context() {
  return {
    components: { Context },
    template: '<Context />',
  }
}
