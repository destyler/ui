import Basic from '../examples/Basic.vue'
import Formatted from '../examples/Formatted.vue'
import FormUsage from '../examples/FormUsage.vue'
import FractionDigits from '../examples/FractionDigits.vue'
import MinMax from '../examples/MinMax.vue'
import MouseWheel from '../examples/MouseWheel.vue'
import NoClamp from '../examples/NoClamp.vue'
import RenderFn from '../examples/RenderFn.vue'
import RootProvider from '../examples/RootProvider.vue'
import Scrubber from '../examples/Scrubber.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / Number Input',
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

export function formattedExample() {
  return {
    components: { Formatted },
    template: '<Formatted />',
  }
}

export function formUsage() {
  return {
    components: { FormUsage },
    template: '<FormUsage />',
  }
}

export function fractionDigits() {
  return {
    components: { FractionDigits },
    template: '<FractionDigits />',
  }
}

export function minMax() {
  return {
    components: { MinMax },
    template: '<MinMax />',
  }
}

export function mouseWheel() {
  return {
    components: { MouseWheel },
    template: '<MouseWheel />',
  }
}

export function noClamp() {
  return {
    components: { NoClamp },
    template: '<NoClamp />',
  }
}

export function renderFn() {
  return {
    components: { RenderFn },
    template: '<RenderFn />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function scrubberExample() {
  return {
    components: { Scrubber },
    template: '<Scrubber />',
  }
}

export function withField() {
  return {
    components: { WithField },
    template: '<WithField />',
  }
}
