import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
import { compatibleDts } from '../packages/vue/build/compatible-dts.ts'

const { transform } = compatibleDts
function rewrite(code: string) {
  return transform.handler(code, 'component.vue.d.ts')
}

test('transforms declarations only, before bundling', () => {
  assert.equal(transform.order, 'pre')
  for (const name of ['component.vue.d.ts', 'context.d.mts', 'context.d.cts'])
    assert.ok(transform.filter.id.test(name))
  for (const name of ['component.vue', 'context.ts', 'context.js'])
    assert.ok(!transform.filter.id.test(name))
})

test('splits all context bindings while preserving types and exports', () => {
  const result = rewrite('export declare const Provider: string, useContext: <T>() => T;')
  const source = ts.createSourceFile('context.d.ts', result, ts.ScriptTarget.Latest, true)
  const declarations = source.statements.filter(ts.isVariableStatement)
  assert.equal(declarations.length, 2)
  assert.ok(declarations.every(statement => statement.declarationList.declarations.length === 1))
  assert.deepEqual(declarations.map(statement => statement.declarationList.declarations[0].name.getText(source)), ['Provider', 'useContext'])
  assert.match(result, /export declare const useContext: <T>\(\) => T/)
})

test('drops only the default twentieth Vue DefineComponent argument', () => {
  const prefix = Array.from({ length: 19 }, () => '{}').join(', ')
  for (const name of ['import("vue").DefineComponent', 'Vue.DefineComponent']) {
    const result = rewrite(`import * as Vue from "vue"; type Component = ${name}<${prefix}, any>;`)
    assert.ok(!result.includes(', any>'))
    const nonDefault = rewrite(`import * as Vue from "vue"; type Component = ${name}<${prefix}, HTMLButtonElement>;`)
    assert.match(nonDefault, /HTMLButtonElement>/)
    const unrelated = rewrite(`type Component = OtherComponent<${prefix}, any>;`)
    assert.match(unrelated, /, any>/)
    assert.match(rewrite(`type Other = import("other").DefineComponent<${prefix}, any>;`), /, any>/)
  }
})
