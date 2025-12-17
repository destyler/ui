import Arrow from '../examples/Arrow.vue'
import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import Positioning from '../examples/Positioning.vue'
import RenderFn from '../examples/RenderFn.vue'
import RootProvider from '../examples/RootProvider.vue'
import Timings from '../examples/Timings.vue'

export default {
  title: 'Components / Tooltip',
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

export function arrow() {
  return {
    components: { Arrow },
    template: '<Arrow />',
  }
}

export function controlled() {
  return {
    components: { Controlled },
    template: '<Controlled />',
  }
}

export function positioning() {
  return {
    components: { Positioning },
    template: '<Positioning />',
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

export function timings() {
  return {
    components: { Timings },
    template: '<Timings />',
  }
}
