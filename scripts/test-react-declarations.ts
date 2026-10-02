import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
import { splitDtsVariableDeclarations } from '../packages/react/build/split-dts-variable-declarations.ts'

const { transform } = splitDtsVariableDeclarations

function split(code: string) {
  const result = transform.handler(code, 'context.d.ts')
  assert.equal(typeof result, 'string')
  return result!
}

test('only declaration files are transformed, before declaration bundling', () => {
  assert.equal(transform.order, 'pre')
  for (const name of ['context.d.ts', 'context.d.mts', 'context.d.cts'])
    assert.ok(transform.filter.id.test(name))
  for (const name of ['context.ts', 'context.tsx', 'context.js', 'context.mjs'])
    assert.ok(!transform.filter.id.test(name))
})

test('single bindings and unrelated declarations are left unchanged', () => {
  assert.equal(transform.handler('export declare const useContext: () => string;', 'context.d.ts'), undefined)
  assert.equal(transform.handler('export interface Context { value: string }', 'context.d.ts'), undefined)
})

test('splitting preserves types, export/declare modifiers, comments, and unrelated statements', () => {
  const result = split(`
    import type { Provider } from 'react';
    interface Context<T> { value: T }
    /** Public context bindings. */
    export declare const ContextProvider: Provider<Context<string>>, useContext: <T>() => Context<T>;
    export declare const independent: number;
  `)
  const source = ts.createSourceFile('context.d.ts', result, ts.ScriptTarget.Latest, true)
  const variables = source.statements.filter(ts.isVariableStatement)
  assert.equal(variables.length, 3)
  assert.ok(variables.every(statement => statement.declarationList.declarations.length === 1))
  assert.deepEqual(variables.map(statement => statement.declarationList.declarations[0].name.getText(source)), ['ContextProvider', 'useContext', 'independent'])
  assert.deepEqual(variables.map(statement => statement.modifiers?.map(modifier => modifier.kind)), Array.from({ length: 3 }, () => [ts.SyntaxKind.ExportKeyword, ts.SyntaxKind.DeclareKeyword]))
  assert.deepEqual(variables.map(statement => statement.declarationList.declarations[0].type?.getText(source).replace(/\s+/g, '')), ['Provider<Context<string>>', '<T>()=>Context<T>', 'number'])
  assert.ok(ts.isImportDeclaration(source.statements[0]))
  assert.ok(ts.isInterfaceDeclaration(source.statements[1]))
  assert.match(result, /Public context bindings\./)
})

test('each later binding retains its generic signature in a strict consumer', () => {
  const files = new Map([
    ['/virtual/context.d.ts', split('declare const initial: string, useContext: <T>(value: T) => T, count: number;')],
    ['/virtual/consumer.ts', 'const text: string = initial; const value: number = useContext(42) + count;'],
  ])
  const options: ts.CompilerOptions = { noEmit: true, strict: true, types: [] }
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const code = files.get(fileName)
    return code === undefined
      ? getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile)
      : ts.createSourceFile(fileName, code, languageVersion, true)
  }
  const program = ts.createProgram([...files.keys()], options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  assert.deepEqual(diagnostics.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')), [])
})
