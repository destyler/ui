import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import RootProvider from '../examples/RootProvider.vue'
import VirtualScroll from '../examples/VirtualScroll.vue'

export default {
  title: 'Components / Scroll Area',
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

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function virtualScroll() {
  return {
    components: { VirtualScroll },
    template: '<VirtualScroll />',
  }
}
