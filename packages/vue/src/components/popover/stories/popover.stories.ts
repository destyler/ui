import Arrow from '../examples/Arrow.vue'
import AsChild from '../examples/AsChild.vue'
import Basic from '../examples/Basic.vue'
import CloseBehavior from '../examples/CloseBehavior.vue'
import Controlled from '../examples/Controlled.vue'
import Modal from '../examples/Modal.vue'
import OnOpenChange from '../examples/OnOpenChange.vue'
import Portalled from '../examples/Portalled.vue'
import Positioning from '../examples/Positioning.vue'
import RenderFn from '../examples/RenderFn.vue'
import RootProvider from '../examples/RootProvider.vue'

export default {
  title: 'Components / Popover',
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

export function closeBehavior() {
  return {
    components: { CloseBehavior },
    template: '<CloseBehavior />',
  }
}
export function onOpenChange() {
  return {
    components: { OnOpenChange },
    template: '<OnOpenChange />',
  }
}

export function portalled() {
  return {
    components: { Portalled },
    template: '<Portalled />',
  }
}

export function positionning() {
  return {
    components: { Positioning },
    template: '<Positioning />',
  }
}

export function arrow() {
  return {
    components: { Arrow },
    template: '<Arrow />',
  }
}

export function asChild() {
  return {
    components: { AsChild },
    template: '<AsChild />',
  }
}

export function renderFn() {
  return {
    components: { RenderFn },
    template: '<RenderFn />',
  }
}
export function modal() {
  return {
    components: { Modal },
    template: '<Modal />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}
