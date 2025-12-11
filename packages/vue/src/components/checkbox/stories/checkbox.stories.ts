import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import Group from '../examples/Group.vue'
import Indeterminate from '../examples/Indeterminate.vue'
import RenderProp from '../examples/RenderProp.vue'
import RootProvider from '../examples/RootProvider.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / Checkbox',
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

export function group() {
  return {
    components: { Group },
    template: '<Group />',
  }
}

export function indeterminateExample() {
  return {
    components: { Indeterminate },
    template: '<Indeterminate />',
  }
}

export function renderProp() {
  return {
    components: { RenderProp },
    template: '<RenderProp />',
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
