import Basic from '../examples/Basic.vue'
import IgnoreCase from '../examples/IgnoreCase.vue'
import MatchAll from '../examples/MatchAll.vue'
import Multiple from '../examples/Multiple.vue'
import WithInput from '../examples/WithInput.vue'

export default {
  title: 'Components / Highlight',
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

export function ignoreCase() {
  return {
    components: { IgnoreCase },
    template: '<IgnoreCase />',
  }
}

export function matchAll() {
  return {
    components: { MatchAll },
    template: '<MatchAll />',
  }
}

export function multiple() {
  return {
    components: { Multiple },
    template: '<Multiple />',
  }
}

export function withInput() {
  return {
    components: { WithInput },
    template: '<WithInput />',
  }
}
