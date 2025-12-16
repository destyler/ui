import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import DisabledTab from '../examples/DisabledTab.vue'
import Indicator from '../examples/Indicator.vue'
import InitialTab from '../examples/InitialTab.vue'
import LazyMount from '../examples/LazyMount.vue'
import Manual from '../examples/Manual.vue'
import RootProvider from '../examples/RootProvider.vue'
import Vertical from '../examples/Vertical.vue'

export default {
  title: 'Components / Tabs',
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

export function disabledTab() {
  return {
    components: { DisabledTab },
    template: '<DisabledTab />',
  }
}

export function indicator() {
  return {
    components: { Indicator },
    template: '<Indicator />',
  }
}

export function initialTab() {
  return {
    components: { InitialTab },
    template: '<InitialTab />',
  }
}

export function lazyMount() {
  return {
    components: { LazyMount },
    template: '<LazyMount />',
  }
}

export function manual() {
  return {
    components: { Manual },
    template: '<Manual />',
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
