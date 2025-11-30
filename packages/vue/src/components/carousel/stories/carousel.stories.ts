import AutoPlay from '../examples/AutoPlay.vue'
import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Carousel',
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

export function autoPlay() {
  return {
    components: { AutoPlay },
    template: '<AutoPlay />',
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
