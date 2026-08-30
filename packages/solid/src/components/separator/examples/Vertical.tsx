import { Separator } from '@destyler-ui/solid/separator'

export function Vertical() {
  return (
    <main style={{ padding: '1rem' }}>
      <nav style={{ 'display': 'flex', 'align-items': 'center', 'gap': '0.5rem' }}>
        <span>Blog</span>
        <Separator.Root orientation="vertical" style={{ height: '1rem' }} />
        <span>Docs</span>
        <Separator.Root orientation="vertical" style={{ height: '1rem' }} />
        <span>Source</span>
      </nav>
    </main>
  )
}
