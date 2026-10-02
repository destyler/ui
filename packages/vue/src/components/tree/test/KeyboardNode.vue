<script setup lang="ts">
import { Tree } from '../index'

interface Node {
  id: string
  disabled?: boolean
  children?: Node[]
}

defineProps<{ node: Node, indexPath: number[], asChild: boolean }>()
</script>

<template>
  <Tree.NodeProvider :node="node" :index-path="indexPath">
    <Tree.Branch v-if="node.children">
      <Tree.BranchControl :as-child="asChild">
        <div v-if="asChild" data-composed>
          <Tree.BranchText>{{ node.id }}</Tree.BranchText>
        </div>
        <Tree.BranchText v-else>{{ node.id }}</Tree.BranchText>
      </Tree.BranchControl>
      <Tree.BranchContent>
        <KeyboardNode
          v-for="(child, index) in node.children"
          :key="child.id"
          :node="child"
          :index-path="[...indexPath, index]"
          :as-child="asChild"
        />
      </Tree.BranchContent>
    </Tree.Branch>
    <Tree.Item v-else :as-child="asChild">
      <div v-if="asChild" data-composed>
        <Tree.ItemText>{{ node.id }}</Tree.ItemText>
      </div>
      <Tree.ItemText v-else>{{ node.id }}</Tree.ItemText>
    </Tree.Item>
  </Tree.NodeProvider>
</template>
