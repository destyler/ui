import Basic from '../examples/Basic.vue'
import checkbox from '../examples/Checkbox.vue'
import Context from '../examples/Context.vue'
import Controlled from '../examples/Controlled.vue'
import Group from '../examples/Group.vue'
import Nested from '../examples/Nested.vue'
import RadioGroup from '../examples/RadioGroup.vue'
import RenderProp from '../examples/RenderProp.vue'
import RootProvider from '../examples/RootProvider.vue'
import Separator from '../examples/Separator.vue'

export default {
  title: 'Components / Menu',
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

export function checkboxMenu() {
  return {
    components: { checkbox },
    template: '<checkbox />',
  }
}

export function contextMenu() {
  return {
    components: { Context },
    template: '<Context />',
  }
}

export function controlledMenu() {
  return {
    components: { Controlled },
    template: '<Controlled />',
  }
}

export function groupMenu() {
  return {
    components: { Group },
    template: '<Group />',
  }
}

export function nestedMenu() {
  return {
    components: { Nested },
    template: '<Nested />',
  }
}

export function radioGroupMenu() {
  return {
    components: { RadioGroup },
    template: '<RadioGroup />',
  }
}

export function renderPropMenu() {
  return {
    components: { RenderProp },
    template: '<RenderProp />',
  }
}

export function rootProviderMenu() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function separatorMenu() {
  return {
    components: { Separator },
    template: '<Separator />',
  }
}
