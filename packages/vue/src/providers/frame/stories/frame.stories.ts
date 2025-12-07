import Basic from '../examples/Basic.vue'
import Script from '../examples/Script.vue'
import SrcDoc from '../examples/SrcDoc.vue'

export default {
  title: 'Components / Frame',
  parameters: {
    layout: 'fullscreen',
  },
}

export function basic() {
  return {
    components: { Basic },
    template: '<div style="--height: 200px"><Basic /></div>',
  }
}

export function script() {
  return {
    components: { Script },
    template: '<div style="--height: 200px"><Script /></div>',
  }
}

export function srcDoc() {
  return {
    components: { SrcDoc },
    template: '<SrcDoc />',
  }
}
