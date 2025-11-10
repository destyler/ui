<script setup lang="ts">
import { getDocument, getWindow } from '@destyler/dom'
import { computed, ref } from 'vue'
import { runIfFn } from '../../utils'
import { EnvironmentContextProvider } from './use-environment-context'
import type {EnvironmentProviderProps} from './type'

const props = defineProps<EnvironmentProviderProps>()
const spanRef = ref<HTMLSpanElement | null>(null)

const getRootNode = () => runIfFn(props.value) ?? spanRef.value?.ownerDocument ?? document

const environment = computed(() => ({
  getRootNode,
  getDocument: () => getDocument(getRootNode()),
  getWindow: () => getWindow(getRootNode()),
}))

EnvironmentContextProvider(environment)
</script>

<template>
  <slot></slot>
  <span v-if="!props.value" hidden ref="spanRef"></span>
</template>
