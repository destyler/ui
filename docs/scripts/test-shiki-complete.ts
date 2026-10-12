import assert from 'node:assert/strict'
import test from 'node:test'
import { Registry } from 'shiki/textmate'
import { highlight } from '../src/utils/shiki'

test('static docs highlighting stays complete when tokenization observes a slow clock', async (t) => {
  const originalLoad = Registry.prototype.loadGrammarWithConfiguration
  const originalNow = Date.now
  const nowDescriptor = Object.getOwnPropertyDescriptor(Date, 'now')!
  const loadDescriptor = Object.getOwnPropertyDescriptor(Registry.prototype, 'loadGrammarWithConfiguration')!
  const grammars = new Map<NonNullable<ReturnType<typeof originalLoad>>, PropertyDescriptor | undefined>()
  const records: { controlled: boolean, line: string, previousState: string, timeLimit: number | undefined, stoppedEarly: boolean }[] = []
  let controlled = false

  // node:test isolates this file from the ordinary nine-language test. Advance
  // only the synchronous tokenizer's clock; keep its real arguments and result.
  Registry.prototype.loadGrammarWithConfiguration = function (...args) {
    const grammar = originalLoad.apply(this, args)
    if (grammar && !grammars.has(grammar)) {
      grammars.set(grammar, Object.getOwnPropertyDescriptor(grammar, 'tokenizeLine2'))
      const originalTokenize = grammar.tokenizeLine2
      grammar.tokenizeLine2 = function (...tokenizeArgs) {
        const previousDescriptor = Object.getOwnPropertyDescriptor(Date, 'now')!
        let clock = Date.now()
        try {
          if (controlled)
            Date.now = () => (clock += 501)
          const result = originalTokenize.apply(this, tokenizeArgs)
          records.push({ controlled, line: tokenizeArgs[0], previousState: String(tokenizeArgs[1]), timeLimit: tokenizeArgs[2], stoppedEarly: result.stoppedEarly })
          return result
        }
        finally {
          Object.defineProperty(Date, 'now', previousDescriptor)
        }
      }
    }
    return grammar
  }

  t.after(() => {
    assert.deepEqual(Object.getOwnPropertyDescriptor(Date, 'now'), nowDescriptor, 'restore the clock descriptor')
    assert.deepEqual(Object.getOwnPropertyDescriptor(Registry.prototype, 'loadGrammarWithConfiguration'), loadDescriptor, 'restore the loader descriptor')
    for (const [grammar, descriptor] of grammars)
      assert.deepEqual(Object.getOwnPropertyDescriptor(grammar, 'tokenizeLine2'), descriptor, 'restore the tokenizer descriptor')
  })

  try {
    const source = '<script setup lang="ts">\nconst value: string = "<p> & text"\n</script>\n<template><p>{{ value }}</p></template>'
    const complete = await highlight(source, 'vue')
    controlled = true
    const underPressure = await highlight(source, 'vue')
    controlled = false
    assert.equal(Date.now, originalNow, 'the controlled clock does not escape the tokenizer')
    t.diagnostic(JSON.stringify({
      tokenizedLines: records.length,
      timeLimits: [...new Set(records.map(record => record.timeLimit))],
      stoppedEarly: records.filter(record => record.stoppedEarly).length,
      controlledLines: records.filter(record => record.controlled).length,
      records,
    }))
    assert.ok(records.some(record => record.controlled), 'exercise the real production tokenizer')
    assert.equal(underPressure, complete, 'slow tokenization must preserve the complete highlighted HTML')
    assert.ok(records.every(record => !record.stoppedEarly), 'complete every tokenized line')
    assert.equal(await highlight(source, 'vue'), complete, 'ordinary highlighting remains stable after restoring the clock')
  }
  finally {
    Object.defineProperty(Registry.prototype, 'loadGrammarWithConfiguration', loadDescriptor)
    for (const [grammar, descriptor] of grammars) {
      if (descriptor)
        Object.defineProperty(grammar, 'tokenizeLine2', descriptor)
      else
        Reflect.deleteProperty(grammar, 'tokenizeLine2')
    }
    Object.defineProperty(Date, 'now', nowDescriptor)
  }
})
