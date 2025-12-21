import Action from '../examples/Action.vue'
import Basic from '../examples/Basic.vue'
import Update from '../examples/Update.vue'

export default {
  title: 'Components / Toast',
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

export function action() {
  return {
    components: { Action },
    template: '<Action />',
  }
}

export function update() {
  return {
    components: { Update },
    template: '<Update />',
  }
}
