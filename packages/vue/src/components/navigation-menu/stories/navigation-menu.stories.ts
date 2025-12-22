import Basic from '../examples/Basic.vue'
import Debug from '../examples/Debug.vue'

export default {
  title: 'Components / Navigation Menu',
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

export function debug() {
  return {
    components: { Debug },
    template: '<Debug />',
  }
}
