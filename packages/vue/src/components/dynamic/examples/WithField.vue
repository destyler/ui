<script setup lang="ts">
import { Field } from '~/components/field'
import { Dynamic } from '../index'
</script>

<template>
  <Field.Root>
    <Dynamic.Root>
      <Dynamic.Context v-slot="tagsInput">
        <Dynamic.Label>Label</Dynamic.Label>
        <Dynamic.Control>
          <Dynamic.Item v-for="(value, index) in tagsInput.value" :key="index" :index="index" :value="value">
            <Dynamic.ItemPreview>
              <Dynamic.ItemText>{{ value }}</Dynamic.ItemText>
              <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
            </Dynamic.ItemPreview>
            <Dynamic.ItemInput />
          </Dynamic.Item>
          <Dynamic.Input placeholder="Add Framework" />
          <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
        </Dynamic.Control>
      </Dynamic.Context>
      <Dynamic.HiddenInput />
    </Dynamic.Root>
    <Field.HelperText>Additional Info</Field.HelperText>
    <Field.ErrorText>Error Info</Field.ErrorText>
  </Field.Root>
</template>
