import { Separator } from '../index'

export function Basic() {
  return (
    <main style={{ width: '300px', padding: '1rem' }}>
      <div>
        <p>Destyler UI</p>
        <p>Unstyled components for React.</p>
      </div>
      <Separator.Root />
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
        <span>Blog</span>
        <Separator.Root orientation="vertical" style={{ height: '1rem' }} />
        <span>Docs</span>
        <Separator.Root orientation="vertical" style={{ height: '1rem' }} />
        <span>Source</span>
      </nav>
    </main>
  )
}
