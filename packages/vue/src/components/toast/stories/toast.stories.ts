import Action from '../examples/Action.vue'
import Basic from '../examples/Basic.vue'
import ToastAction from '../examples/ToastAction.vue'
import ToastPlacement from '../examples/ToastPlacement.vue'
import ToastPromise from '../examples/ToastPromise.vue'
import ToastTypes from '../examples/ToastTypes.vue'
import ToastUpdate from '../examples/ToastUpdate.vue'
import Update from '../examples/Update.vue'

export default {
  title: 'Components / Toast',
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

export function action() {
  return {
    components: { Action },
    template: '<Action />',
  }
}

export function toastAction() {
  return {
    components: { ToastAction },
    template: '<ToastAction />',
  }
}

export function toastPlacement() {
  return {
    components: { ToastPlacement },
    template: '<ToastPlacement />',
  }
}

export function toastPromise() {
  return {
    components: { ToastPromise },
    template: '<ToastPromise />',
  }
}

export function toastTypes() {
  return {
    components: { ToastTypes },
    template: '<ToastTypes />',
  }
}

export function toastUpdate() {
  return {
    components: { ToastUpdate },
    template: '<ToastUpdate />',
  }
}

export function update() {
  return {
    components: { Update },
    template: '<Update />',
  }
}
