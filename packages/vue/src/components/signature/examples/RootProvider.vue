<script setup lang="ts">
import { Signature, useSignature } from '../index'

const signaturePad = useSignature()
</script>

<template>
  <button @click="signaturePad.clear()">Clear</button>

  <Signature.RootProvider :value="signaturePad">
    <Signature.Label>Sign below</Signature.Label>
    <Signature.Control>
      <Signature.Segment />
      <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
      <Signature.Guide />
    </Signature.Control>
  </Signature.RootProvider>
</template>
