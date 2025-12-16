import Basic from '../examples/Basic.vue'
import CenterOrigin from '../examples/CenterOrigin.vue'
import DraggingIndicator from '../examples/DraggingIndicator.vue'
import InitialValue from '../examples/InitialValue.vue'
import MinMax from '../examples/MinMax.vue'
import OnEvent from '../examples/OnEvent.vue'
import Range from '../examples/Range.vue'
import RootProvider from '../examples/RootProvider.vue'
import Step from '../examples/Step.vue'
import Vertical from '../examples/Vertical.vue'
import WithMarks from '../examples/WithMarks.vue'

export default {
  title: 'Components / Slider',
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

export function withMarks() {
  return {
    components: { WithMarks },
    template: '<WithMarks />',
  }
}

export function draggingIndicator() {
  return {
    components: { DraggingIndicator },
    template: '<DraggingIndicator />',
  }
}

export function minMax() {
  return {
    components: { MinMax },
    template: '<MinMax />',
  }
}

export function onEvent() {
  return {
    components: { OnEvent },
    template: '<OnEvent />',
  }
}

export function range() {
  return {
    components: { Range },
    template: '<Range />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
export function step() {
  return {
    components: { Step },
    template: '<Step />',
  }
}
export function centerOrigin() {
  return {
    components: { CenterOrigin },
    template: '<CenterOrigin />',
  }
}

export function initialValue() {
  return {
    components: { InitialValue },
    template: '<InitialValue />',
  }
}

export function vertical() {
  return {
    components: { Vertical },
    template: '<Vertical />',
  }
}


