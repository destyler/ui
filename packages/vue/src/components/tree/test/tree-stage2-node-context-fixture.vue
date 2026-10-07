<script setup lang="ts">
import type { UseTreeProps } from '../composables/use-tree'
import { defineComponent, h, ref } from 'vue'
import { createTreeCollection, Tree, useTree } from '../index'

interface Node {
  key: string
  label: string
  disabled?: boolean
  items?: Node[]
}

const props = defineProps<{ rootProvider?: boolean, uncontrolled?: boolean }>()
const updated = ref(false)
const swapped = ref(false)
const leaf: Node = { key: 'leaf', label: 'Custom leaf' }
const branch: Node = { key: 'branch', label: 'Custom branch', items: [leaf] }
const other: Node = { key: 'other', label: 'Disabled branch', disabled: true, items: [{ key: 'other-leaf', label: 'Other leaf' }] }
const collection = createTreeCollection<Node>({
  rootNode: { key: 'root', label: 'Root', items: [branch, other] },
  nodeToValue: node => node.key,
  nodeToString: node => node.label,
  nodeToChildren: node => node.items ?? [],
})

const ProviderRoot = defineComponent({
  props: ['id', 'collection', 'selectedValue', 'defaultSelectedValue', 'expandedValue', 'focusedValue'],
  setup(rootProps, { slots }) {
    const tree = useTree(rootProps as UseTreeProps<Node>)
    return () => h(Tree.RootProvider<Node>, { value: tree.value }, slots)
  },
})
const Root = props.rootProvider ? ProviderRoot : Tree.Root
</script>

<template>
  <button type="button" data-update @click="updated = !updated">
    Update state
  </button>
  <button type="button" data-swap @click="swapped = !swapped">
    Swap node
  </button>
  <Root
    id="node-context"
    :collection="collection"
    :selected-value="uncontrolled ? undefined : updated ? ['branch'] : ['leaf']"
    :default-selected-value="['leaf']"
    :expanded-value="uncontrolled ? undefined : updated ? ['branch'] : []"
    :focused-value="updated ? 'branch' : 'leaf'"
  >
    <Tree.Context v-slot="api">
      <button
        type="button" data-api-update @click="() => {
          api.setSelectedValue(api.selectedValue.includes('branch') ? ['leaf'] : ['branch'])
          api.setExpandedValue(api.expandedValue.length ? [] : ['branch'])
        }"
      >
        Update through API
      </button>
    </Tree.Context>
    <Tree.NodeProvider :node="branch" :index-path="[0]">
      <Tree.NodeContext v-slot="state">
        <output data-node-state="outer-before">{{ JSON.stringify(state) }}</output>
      </Tree.NodeContext>
      <Tree.BranchControl>Custom branch</Tree.BranchControl>
      <Tree.NodeProvider :node="swapped ? other : leaf" :index-path="swapped ? [1] : [0, 0]">
        <Tree.NodeContext v-slot="state">
          <output data-node-state="inner">{{ JSON.stringify(state) }}</output>
        </Tree.NodeContext>
      </Tree.NodeProvider>
      <Tree.NodeContext v-slot="state">
        <output data-node-state="outer-after">{{ JSON.stringify(state) }}</output>
      </Tree.NodeContext>
    </Tree.NodeProvider>
    <Tree.NodeProvider :node="other" :index-path="[1]">
      <Tree.NodeContext v-slot="state">
        <output data-node-state="sibling">{{ JSON.stringify(state) }}</output>
      </Tree.NodeContext>
    </Tree.NodeProvider>
  </Root>
</template>
