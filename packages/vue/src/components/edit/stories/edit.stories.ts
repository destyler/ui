import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import CustomControls from '../examples/CustomControls.vue'
import InitialValue from '../examples/InitialValue.vue'
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

export function controlled() {
  return {
    components: { Controlled },
    template: '<Controlled />',
  }
}

export function initialValue() {
  return {
    components: { InitialValue },
    template: '<InitialValue />',
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
