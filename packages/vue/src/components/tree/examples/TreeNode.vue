<script setup lang="ts">
import { Tree } from '../index'

interface Node {
  id: string
  name: string
  children?: Node[]
}

interface Props {
  node: Node
  indexPath: number[]
}

defineProps<Props>()
</script>

<template>
  <Tree.NodeProvider :node="node" :indexPath="indexPath">
    <template v-if="node.children">
      <Tree.Branch>
        <Tree.BranchControl>
          <Tree.BranchText>
            📁
            {{ node.name }}
          </Tree.BranchText>
          <Tree.BranchIndicator>
            ▶
          </Tree.BranchIndicator>
        </Tree.BranchControl>
        <Tree.BranchContent>
          <Tree.BranchIndentGuide />
          <TreeNode
            v-for="(child, index) in node.children"
            :key="child.id"
            :node="child"
            :indexPath="[...indexPath, index]"
          />
        </Tree.BranchContent>
      </Tree.Branch>
    </template>
    <template v-else>
      <Tree.Item>
        <Tree.ItemIndicator>
          •
        </Tree.ItemIndicator>
        <Tree.ItemText>
          <File />
          {{ node.name }}
        </Tree.ItemText>
      </Tree.Item>
    </template>
  </Tree.NodeProvider>
</template>
