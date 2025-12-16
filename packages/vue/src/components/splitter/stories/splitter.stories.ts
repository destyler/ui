import Basic from '../examples/Basic.vue'
import Event from '../examples/Events.vue'
import RenderProp from '../examples/RenderProp.vue'
import RootProvider from '../examples/RootProvider.vue'
import Vertical from '../examples/Vertical.vue'

export default {
  title: 'Components / Splitter',
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

export function event() {
  return {
    components: { Event },
    template: '<Event />',
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

export function vertical() {
  return {
    components: { Vertical },
    template: '<Vertical />',
  }
}
