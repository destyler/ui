import Advanced from '../examples/Advanced.vue'
import Basic from '../examples/Basic.vue'
import RootProvider from '../examples/RootProvider.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / Combobox',
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

export function withField() {
  return {
    components: { WithField },
    template: '<WithField />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function advanced() {
  return {
    components: { Advanced },
    template: '<Advanced />',
  }
}
