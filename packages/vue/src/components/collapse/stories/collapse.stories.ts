import Basic from '../examples/Basic.vue'
import Collapsible from '../examples/Collapsible.vue'
import ContextFocusedValue from '../examples/ContextFocusedValue.vue'
import ContextGetItemState from '../examples/ContextGetItemState.vue'
import ContextSetValue from '../examples/ContextSetValue.vue'
import ContextValue from '../examples/ContextValue.vue'
import Controlled from '../examples/Controlled.vue'
import Disabled from '../examples/Disabled.vue'
import Horizontal from '../examples/Horizontal.vue'
import Multiple from '../examples/Multiple.vue'
import RenderProp from '../examples/RenderProp.vue'
import RootProvider from '../examples/RootProvider.vue'
import Vertical from '../examples/Vertical.vue'

export default {
  title: 'Components / Collapse',
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}

export function basic() {
  return {
    components: { Basic },
    template: '<Basic />',
  }
}

export function collapsible() {
  return {
    components: { Collapsible },
    template: '<Collapsible />',
  }
}

export function controlled() {
  return {
    components: { Controlled },
    template: '<Controlled />',
  }
}

export function disabled() {
  return {
    components: { Disabled },
    template: '<Disabled />',
  }
}

export function horizontal() {
  return {
    components: { Horizontal },
    template: '<Horizontal />',
  }
}

export function multiple() {
  return {
    components: { Multiple },
    template: '<Multiple />',
  }
}

export function renderProp() {
  return {
    components: { RenderProp },
    template: '<RenderProp />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function vertical() {
  return {
    components: { Vertical },
    template: '<Vertical />',
  }
}

export function contextFocusedValue() {
  return {
    components: { ContextFocusedValue },
    template: '<ContextFocusedValue />',
  }
}

export function contextGetItemState() {
  return {
    components: { ContextGetItemState },
    template: '<ContextGetItemState />',
  }
}

export function contextSetValue() {
  return {
    components: { ContextSetValue },
    template: '<ContextSetValue />',
  }
}

export function contextValue() {
  return {
    components: { ContextValue },
    template: '<ContextValue />',
  }
}
