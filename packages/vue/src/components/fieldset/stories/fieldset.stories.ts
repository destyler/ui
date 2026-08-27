import Basic from '../examples/Basic.vue'
import WithCheckbox from '../examples/WithCheckbox.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / Fieldset',
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

export function withCheckbox() {
  return {
    components: { WithCheckbox },
    template: '<WithCheckbox />',
  }
}

export function withField() {
  return {
    components: { WithField },
    template: '<WithField />',
  }
}
