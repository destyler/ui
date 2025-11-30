import Basic from '../examples/Basic.vue'
import Context from '../examples/Context.vue'
import Event from '../examples/Event.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Avatar',
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

export function context() {
  return {
    components: { Context },
    template: '<Context />',
  }
}

export function event() {
  return {
    components: { Event },
    template: '<Event />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
