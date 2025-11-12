import Basic from '../examples/Basic.vue'
import LazyMount from '../examples/LazyMount.vue'
import LazyMountAndUnmountOnExit from '../examples/LazyMountAndUnmountOnExit.vue'
import OnExitComplete from '../examples/OnExitComplete.vue'
import RootProvider from '../examples/RootProvider.vue'
import UnmountOnExit from '../examples/UnmountOnExit.vue'

export default {
  title: 'Components / Collapsible',
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

export function lazyMountAndUnmountOnExit() {
  return {
    components: { LazyMountAndUnmountOnExit },
    template: '<LazyMountAndUnmountOnExit />',
  }
}

export function lazyMount() {
  return {
    components: { LazyMount },
    template: '<LazyMount />',
  }
}

export function onExitComplete() {
  return {
    components: { OnExitComplete },
    template: '<OnExitComplete />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function unmountOnExit() {
  return {
    components: { UnmountOnExit },
    template: '<UnmountOnExit />',
  }
}
