import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import DefaultOpen from '../examples/DefaultOpen.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Floating Panel',
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

export function defaultOpen() {
  return {
    components: { DefaultOpen },
    template: '<DefaultOpen />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
