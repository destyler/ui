import { cleanup, render, screen } from '@solidjs/testing-library'
import { Tree, treeAnatomy } from '..'
import { getExports, getParts } from '../../../setup-test'
import { Basic as ComponentUnderTest } from '../examples/Basic'

describe('tree / Parts & Exports', () => {
  afterAll(() => {
    cleanup()
  })

  it.each(getParts(treeAnatomy).filter(x => x.includes('branchTrigger')))(
    'should render part %s',
    async (part) => {
      render(() => <ComponentUnderTest />)
      expect(document.querySelector(part)).toBeInTheDocument()
    },
  )

  it.each(getExports(treeAnatomy))('should export %s', async (part) => {
    expect(Tree[part]).toBeDefined()
  })
})

describe('tree', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render a leaf node correctly', () => {
    render(() => <ComponentUnderTest />)
    expect(screen.getByRole('treeitem', { name: 'README.md' })).toBeInTheDocument()
  })

  it('should render a branch node correctly', () => {
    render(() => <ComponentUnderTest />)
    expect(screen.getByRole('treeitem', { name: 'src' })).toBeInTheDocument()
  })

  it('should expand branch node to reveal child leaf node', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.getByRole('treeitem', { name: 'src' })).toBeInTheDocument()

    const trigger = screen.getByRole('button', { name: 'src' })
    trigger.click()

    expect(await screen.findByText('app.tsx')).toBeInTheDocument()
  })
})
