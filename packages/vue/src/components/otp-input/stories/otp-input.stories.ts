import Basic from '../examples/Basic.vue'

export default {
  title: 'Components / Otp Input',
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
