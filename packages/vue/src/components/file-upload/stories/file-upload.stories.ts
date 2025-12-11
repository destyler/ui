import Basic from '../examples/Basic.vue'
import RootProvider from '../examples/RootProvider.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / File Upload',
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

export function withField() {
  return {
    components: { WithField },
    template: '<WithField />',
  }
}
