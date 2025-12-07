<script setup lang="ts">
import { Format } from '../index'
import { LocaleProvider } from '../../locale'
</script>

<template>
  <LocaleProvider locale="de-DE">
    <Format.Number :value="1450.45" />
  </LocaleProvider>
</template>
