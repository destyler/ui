import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import LazyMount from '../examples/LazyMount.vue'
import RenderFn from '../examples/RenderFn.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Dialog',
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

export function lazyMount() {
  return {
    components: { LazyMount },
    template: '<LazyMount />',
  }
}

export function renderFn() {
  return {
    components: { RenderFn },
    template: '<RenderFn />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
