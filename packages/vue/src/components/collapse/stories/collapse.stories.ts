import Basic from '../examples/basic.vue'

export default {
  title: 'Components / Collapse',
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}

export const basic = () => ({
  components: { Basic },
  template: '<Basic />',
})



