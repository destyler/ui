import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import CustomDelay from '../examples/CustomDelay.vue'
import DisableClick from '../examples/DisableClick.vue'
import DisableHover from '../examples/DisableHover.vue'
import RootProvider from '../examples/RootProvider.vue'
import Vertical from '../examples/Vertical.vue'

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

export function controlled() {
  return {
    components: { Controlled },
    template: '<Controlled />',
  }
}

export function vertical() {
  return {
    components: { Vertical },
    template: '<Vertical />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function customDelay() {
  return {
    components: { CustomDelay },
    template: '<CustomDelay />',
  }
}

export function disableHover() {
  return {
    components: { DisableHover },
    template: '<DisableHover />',
  }
}

export function disableClick() {
  return {
    components: { DisableClick },
    template: '<DisableClick />',
  }
}
