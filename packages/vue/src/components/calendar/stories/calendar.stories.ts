import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import Range from '../examples/Range.vue'
import RootProvider from '../examples/RootProvider.vue'
import Standalone from '../examples/Standalone.vue'

export default {
  title: 'Components / Calendar',
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

export function range() {
  return {
    components: { Range },
    template: '<Range />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function standalone() {
  return {
    components: { Standalone },
    template: '<Standalone />',
  }
}
