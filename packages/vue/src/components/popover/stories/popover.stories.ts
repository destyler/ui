import Basic from '../examples/Basic.vue'

export default {
  title: 'Components / Popover',
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
