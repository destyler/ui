import Basic from '../examples/Basic.vue'
import Disabled from '../examples/Disabled.vue'
import Input from '../examples/Input.vue'
import InputControlled from '../examples/InputControlled.vue'
import ReactiveInvalid from '../examples/ReactiveInvalid.vue'
import RequiredIndicator from '../examples/RequiredIndicator.vue'
import Select from '../examples/Select.vue'
import SelectControlled from '../examples/SelectControlled.vue'
import Textarea from '../examples/Textarea.vue'
import TextareaAutoresize from '../examples/TextareaAutoresize.vue'
import TextareaControlled from '../examples/TextareaControlled.vue'

export default {
  title: 'Components / Field',
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

export function disabled() {
  return {
    components: { Disabled },
    template: '<Disabled />',
  }
}

export function input() {
  return {
    components: { Input },
    template: '<Input />',
  }
}

export function inputControlled() {
  return {
    components: { InputControlled },
    template: '<InputControlled />',
  }
}

export function reactiveInvalid() {
  return {
    components: { ReactiveInvalid },
    template: '<ReactiveInvalid />',
  }
}

export function requiredIndicator() {
  return {
    components: { RequiredIndicator },
    template: '<RequiredIndicator />',
  }
}

export function select() {
  return {
    components: { Select },
    template: '<Select />',
  }
}

export function selectControlled() {
  return {
    components: { SelectControlled },
    template: '<SelectControlled />',
  }
}

export function textarea() {
  return {
    components: { Textarea },
    template: '<Textarea />',
  }
}

export function textareaAutoresize() {
  return {
    components: { TextareaAutoresize },
    template: '<TextareaAutoresize />',
  }
}

export function textareaControlled() {
  return {
    components: { TextareaControlled },
    template: '<TextareaControlled />',
  }
}
