import Basic from '../examples/Basic.vue'
import CustomControls from '../examples/CustomControls.vue'
import RootProvider from '../examples/RootProvider.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / Edit',
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

export function customControls() {
  return {
    components: { CustomControls },
    template: '<CustomControls />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
