import Basic from '../examples/Basic.vue'
import BlurBehavior from '../examples/BlurBehavior.vue'
import DisabledEditing from '../examples/DisabledEditing.vue'
import InitialValue from '../examples/InitialValue.vue'
import MaxWithOverflow from '../examples/MaxWithOverflow.vue'
import OnEvent from '../examples/OnEvent.vue'
import PasteBehavior from '../examples/PasteBehavior.vue'
import RootProvider from '../examples/RootProvider.vue'
import Validated from '../examples/Validated.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / Dynamic',
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

export function blurBehavior() {
  return {
    components: { BlurBehavior },
    template: '<BlurBehavior />',
  }
}

export function disabledEditing() {
  return {
    components: { DisabledEditing },
    template: '<DisabledEditing />',
  }
}
export function initialValue() {
  return {
    components: { InitialValue },
    template: '<InitialValue />',
  }
}
export function maxWithOverflow() {
  return {
    components: { MaxWithOverflow },
    template: '<MaxWithOverflow />',
  }
}
export function onEvent() {
  return {
    components: { OnEvent },
    template: '<OnEvent />',
  }
}
export function pasteBehavior() {
  return {
    components: { PasteBehavior },
    template: '<PasteBehavior />',
  }
}
export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
export function validated() {
  return {
    components: { Validated },
    template: '<Validated />',
  }
}
export function withField() {
  return {
    components: { WithField },
    template: '<WithField />',
  }
}
