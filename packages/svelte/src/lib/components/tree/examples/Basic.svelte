<script lang="ts">
  import { Tree, createTreeCollection } from '../index'
  import TreeNode from './TreeNode.svelte'

  interface Node {
    id: string
    name: string
    children?: Node[]
  }

  const collection = createTreeCollection<Node>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: {
      id: 'ROOT',
      name: '',
      children: [
        {
          id: 'node_modules',
          name: 'node_modules',
          children: [
            { id: 'node_modules/destyler', name: 'destyler' },
            { id: 'node_modules/unocss', name: 'unocss' },
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
        { id: 'uno.config', name: 'uno.config.ts' },
        { id: 'package.json', name: 'package.json' },
        { id: 'renovate.json', name: 'renovate.json' },
        { id: 'readme.md', name: 'README.md' },
      ],
    },
  })
</script>

<Tree.Root {collection}>
  <Tree.Label>Tree</Tree.Label>
  <Tree.Tree>
    {#each collection.rootNode.children ?? [] as node, index (node.id)}
      <TreeNode {node} indexPath={[index]} />
    {/each}
  </Tree.Tree>
</Tree.Root>
