import { createTreeCollection, Tree, useTree } from '@destyler-ui/solid/tree'
import { CheckSquareIcon, ChevronRightIcon, FileIcon, FolderIcon } from 'lucide-solid'
import { For, Show } from 'solid-js'

interface Node {
  id: string
  name: string
  children?: Node[]
}

const collection = createTreeCollection<Node>({
  nodeToValue: node => node.id,
  nodeToString: node => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'node_modules',
        name: 'node_modules',
        children: [
          { id: 'node_modules/zag-js', name: 'zag-js' },
          { id: 'node_modules/pandacss', name: 'panda' },
          {
            id: 'node_modules/@types',
            name: '@types',
            children: [
              { id: 'node_modules/@types/react', name: 'react' },
              { id: 'node_modules/@types/react-dom', name: 'react-dom' },
            ],
          },
        ],
      },
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'src/app.tsx', name: 'app.tsx' },
          { id: 'src/index.ts', name: 'index.ts' },
        ],
      },
      { id: 'panda.config', name: 'panda.config.ts' },
      { id: 'package.json', name: 'package.json' },
      { id: 'renovate.json', name: 'renovate.json' },
      { id: 'readme.md', name: 'README.md' },
    ],
  },
})

export function RootProvider() {
  const tree = useTree({ collection })

  return (
    <Tree.RootProvider value={tree}>
      <Tree.Label>Tree</Tree.Label>
      <Tree.Tree>
        <For each={collection.rootNode.children}>
          {(node, index) => <TreeNode node={node} indexPath={[index()]} />}
        </For>
      </Tree.Tree>
    </Tree.RootProvider>
  )
}

function TreeNode(props: Tree.NodeProviderProps<Node>) {
  const { node, indexPath } = props
  return (
    <Tree.NodeProvider node={node} indexPath={indexPath}>
      <Show
        when={node.children}
        fallback={(
          <Tree.Item>
            <Tree.ItemIndicator>
              <CheckSquareIcon />
            </Tree.ItemIndicator>
            <Tree.ItemText>
              <FileIcon />
              {node.name}
            </Tree.ItemText>
          </Tree.Item>
        )}
      >
        <Tree.Branch>
          <Tree.BranchControl>
            <Tree.BranchText>
              <FolderIcon /> {node.name}
            </Tree.BranchText>
            <Tree.BranchIndicator>
              <ChevronRightIcon />
            </Tree.BranchIndicator>
          </Tree.BranchControl>
          <Tree.BranchContent>
            <Tree.BranchIndentGuide />
            <For each={node.children}>
              {(child, index) => <TreeNode node={child} indexPath={[...indexPath, index()]} />}
            </For>
          </Tree.BranchContent>
        </Tree.Branch>
      </Show>
    </Tree.NodeProvider>
  )
}
