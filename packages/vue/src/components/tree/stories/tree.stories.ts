import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'

export default {
  title: 'Components / Tree',
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
