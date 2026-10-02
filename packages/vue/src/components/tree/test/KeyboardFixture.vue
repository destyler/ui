<script setup lang="ts">
import type { ExpandedChangeDetails, FocusChangeDetails, SelectionChangeDetails } from '@destyler/tree'
import { ref } from 'vue'
import { Tree, createTreeCollection } from '../index'
import KeyboardNode from './KeyboardNode.vue'

interface Node {
  id: string
  disabled?: boolean
  children?: Node[]
}

const props = withDefaults(defineProps<{
  nodes: Node[]
  initialExpanded?: string[]
  initialSelected?: string[]
  asChild?: boolean
  controlled?: boolean
  onExpandedChange?: (details: ExpandedChangeDetails) => void
  onSelectionChange?: (details: SelectionChangeDetails) => void
  onFocusChange?: (details: FocusChangeDetails) => void
}>(), {
  initialExpanded: () => [],
  initialSelected: () => [],
})

const collection = createTreeCollection<Node>({
  nodeToValue: node => node.id,
  nodeToString: node => node.id,
  rootNode: { id: 'root', children: props.nodes },
})
const expandedValue = ref([...props.initialExpanded])
const selectedValue = ref([...props.initialSelected])

function onExpandedChange(details: ExpandedChangeDetails) {
  props.onExpandedChange?.(details)
  expandedValue.value = details.expandedValue
}

function onSelectionChange(details: SelectionChangeDetails) {
  props.onSelectionChange?.(details)
  selectedValue.value = details.selectedValue
}
</script>

<template>
  <output data-expanded>{{ JSON.stringify(expandedValue) }}</output>
  <output data-selected>{{ JSON.stringify(selectedValue) }}</output>
  <Tree.Root
    :collection="collection"
    selection-mode="multiple"
    :default-expanded-value="initialExpanded"
    :default-selected-value="initialSelected"
    :expanded-value="controlled ? expandedValue : undefined"
    :selected-value="controlled ? selectedValue : undefined"
    @expanded-change="onExpandedChange"
    @selection-change="onSelectionChange"
    @focus-change="onFocusChange"
  >
    <Tree.Label>Keyboard regression tree</Tree.Label>
    <Tree.Tree>
      <KeyboardNode
        v-for="(node, index) in nodes"
        :key="node.id"
        :node="node"
        :index-path="[index]"
        :as-child="asChild"
      />
    </Tree.Tree>
  </Tree.Root>
</template>
