import Basic from '../examples/Basic.vue'
import ImagePreview from '../examples/ImagePreview.vue'
import RootProvider from '../examples/RootProvider.vue'
import WithField from '../examples/WithField.vue'

export default {
  title: 'Components / Signature',
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

export function imagePreview() {
  return {
    components: { ImagePreview },
    template: '<ImagePreview />',
  }
}

export function rootProvider() {
  return {
    components: { RootProvider },
    template: '<RootProvider />',
  }
}

export function withField(): any {
  return {
    components: { WithField },
    template: '<WithField />',
  }
}
