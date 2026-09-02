import { Highlight } from '@destyler-ui/solid/highlight'

export function Multiple() {
  return (
    <Highlight
      query={['ipsum', 'amet']}
      text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt"
    />
  )
}
