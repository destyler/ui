import { ui } from '@destyler-ui/solid/factory'

export function UIFactory() {
  return (
    <ui.div
      id="parent"
      class="parent"
      style={{ background: 'red' }}
      asChild={props => (
        <ui.span {...props({ id: 'child', class: 'child', style: { color: 'blue' } })} />
      )}
    >
      Destyler UI
    </ui.div>
  )
}
