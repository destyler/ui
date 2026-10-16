import assert from 'node:assert/strict'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import compat from '../tooling/eslint-react-compat/index.mjs'
import solid from '../tooling/eslint-solid/index.mjs'

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const severities = {
  'jsx-no-duplicate-props': 1,
  'prefer-namespace-import': 2,
  'no-default-props': 2,
  'no-prop-types': 2,
  'no-redundant-should-component-update': 2,
  'no-string-refs': 2,
  'no-useless-forward-ref': 1,
  'no-implicit-key': 1,
  'no-use-context': 1,
}

async function messages(name, source, settings = {}, globals = {}) {
  const eslint = new ESLint({
    cwd,
    overrideConfigFile: true,
    overrideConfig: [{
      files: ['**/*.{js,jsx,ts,tsx}'],
      languageOptions: {
        globals,
        parser: solid.languageOptions.parser,
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      settings: { 'react-x': { version: '19.3.0', ...settings } },
      plugins: { compat },
      rules: { [`compat/${name}`]: severities[name] },
    }],
  })
  const [result] = await eslint.lintText(source, { filePath: 'packages/react/src/compat-probe.tsx' })
  assert.equal(result.fatalErrorCount, 0, JSON.stringify(result.messages))
  for (const message of result.messages) {
    assert.equal(message.ruleId, `compat/${name}`)
    assert.equal(message.severity, severities[name])
    assert.equal(message.fix, undefined, 'The diagnostic bridge must not introduce implicit fixes')
  }
  return result.messages
}

const fixtures = {
  'jsx-no-duplicate-props': [
    ['repeated property', '<div id="one" id="two" />', 1],
    ['each additional duplicate', '<div id="one" id="two" id="three" />', 2],
    ['distinct and case-sensitive properties', '<div id="one" ID="two" />', 0],
    ['spreads are not fabricated duplicates', '<div {...props} id="one" {...props} />', 0],
    ['namespaced properties are outside the legacy guard', '<svg xlink:href="a" xlink:href="b" />', 0],
  ],
  'prefer-namespace-import': [
    ['default import', 'import React from "react"', 1],
    ['type-only default import', 'import type React from "react"', 1],
    ['aliased default import', 'import R from "react"', 1],
    ['mixed default and named imports', 'import React, { useState } from "react"', 1],
    ['namespace and named imports', 'import * as React from "react"; import { useState } from "react"', 0],
    ['non-React default import', 'import React from "another-library"', 0],
  ],
  'no-default-props': [
    ['function declaration', 'function Probe() { return null }; Probe.defaultProps = {}', 1],
    ['arrow component', 'const Probe = () => null; Probe.defaultProps = {}', 1],
    ['class defaultProps remain allowed', 'import { Component } from "react"; class Probe extends Component {}; Probe.defaultProps = {}', 0],
    ['ordinary object', 'const Probe = {}; Probe.defaultProps = {}', 0],
    ['lowercase helper', 'function helper() {}; helper.defaultProps = {}', 0],
    ['shadowed component parameter', 'const Probe = () => null; function setup(Probe) { Probe.defaultProps = {} }', 0],
    ['imported component without a local definition', 'import Probe from "./probe"; Probe.defaultProps = {}', 0],
    ['identifier alias is not a function definition', 'const Original = () => null; const Probe = Original; Probe.defaultProps = {}', 0],
    ['default parameter alternative', 'function Probe({ value = 1 }) { return value }', 0],
  ],
  'no-prop-types': [
    ['function property', 'const Probe = () => null; Probe.propTypes = {}', 1],
    ['React class property', 'import { Component } from "react"; class Probe extends Component {}; Probe.propTypes = {}', 1],
    ['aliased base class static property', 'import { Component as Base } from "react"; class Probe extends Base { static propTypes = {} }', 1],
    ['namespace base class static property', 'import * as R from "react"; class Probe extends R.Component { static propTypes = {} }', 1],
    ['instance property is not static propTypes', 'import { Component } from "react"; class Probe extends Component { propTypes = {} }', 0],
    ['ordinary object', 'const Probe = {}; Probe.propTypes = {}', 0],
    ['non-React base class', 'import { Component } from "another-library"; class Probe extends Component { static propTypes = {} }', 0],
    ['shadowed base class', 'import { Component } from "react"; function setup(Component) { class Probe extends Component { static propTypes = {} } }', 0],
    ['shadowed namespace object', 'import * as React from "react"; function setup(React) { class Probe extends React.Component { static propTypes = {} } }', 0],
    ['component parameter', 'function setup(Probe) { Probe.propTypes = {} }', 0],
    ['unbound global React class', 'class Probe extends React.Component { static propTypes = {} }', 0],
    ['destructured CommonJS Component', 'const { Component } = require("react"); class Probe extends Component { static propTypes = {} }', 1],
    ['renamed CommonJS Component', 'const { Component: Base } = require("react"); class Probe extends Base { static propTypes = {} }', 1],
  ],
  'no-redundant-should-component-update': [
    ['PureComponent method', 'import { PureComponent } from "react"; class Probe extends PureComponent { shouldComponentUpdate() { return true } }', 1],
    ['aliased PureComponent arrow member', 'import { PureComponent as Pure } from "react"; const Probe = class extends Pure { shouldComponentUpdate = () => true }', 1],
    ['namespace PureComponent', 'import * as R from "react"; class Probe extends R.PureComponent { shouldComponentUpdate() { return true } }', 1],
    ['Component method is permitted', 'import { Component } from "react"; class Probe extends Component { shouldComponentUpdate() { return true } }', 0],
    ['PureComponent without redundant member', 'import { PureComponent } from "react"; class Probe extends PureComponent { render() { return null } }', 0],
    ['non-React PureComponent', 'import { PureComponent } from "another-library"; class Probe extends PureComponent { shouldComponentUpdate() {} }', 0],
    ['shadowed PureComponent', 'import { PureComponent } from "react"; function setup(PureComponent) { class Probe extends PureComponent { shouldComponentUpdate() {} } }', 0],
    ['ordinary object method', 'const Probe = { shouldComponentUpdate() { return true } }', 0],
    ['unbound global PureComponent', 'class Probe extends PureComponent { shouldComponentUpdate() {} }', 0],
    ['destructured CommonJS PureComponent', 'const { PureComponent } = require("react"); class Probe extends PureComponent { shouldComponentUpdate() {} }', 1],
    ['renamed CommonJS PureComponent', 'const { PureComponent: Pure } = require("react"); class Probe extends Pure { shouldComponentUpdate() {} }', 1],
  ],
  'no-string-refs': [
    ['string attribute', '<div ref="node" />', 1],
    ['string expression', '<div ref={"node"} />', 1],
    // eslint-disable-next-line no-template-curly-in-string -- This is JSX source for the template-ref regression.
    ['template literal', '<div ref={`node-${id}`} />', 1],
    ['callback ref', '<div ref={node => { current = node }} />', 0],
    ['object ref', '<div ref={ref} />', 0],
    ['null ref', '<div ref={null} />', 0],
    ['other string attribute', '<div title="node" />', 0],
  ],
  'no-useless-forward-ref': [
    ['missing ref parameter', 'import { forwardRef } from "react"; forwardRef(props => <div />)', 1],
    ['aliased forwardRef', 'import { forwardRef as forward } from "react"; forward(() => <div />)', 1],
    ['namespace forwardRef', 'import * as R from "react"; R.forwardRef(function Probe(props) { return <div /> })', 1],
    ['ref parameter present', 'import { forwardRef } from "react"; forwardRef((props, ref) => <div ref={ref} />)', 0],
    ['indirect component is outside legacy guard', 'import { forwardRef } from "react"; const Probe = () => null; forwardRef(Probe)', 0],
    ['non-React forwardRef', 'import { forwardRef } from "another-library"; forwardRef(() => null)', 0],
    ['local same-named function', 'const forwardRef = fn => fn; forwardRef(() => null)', 0],
    ['shadowed imported function', 'import { forwardRef } from "react"; function setup(forwardRef) { forwardRef(() => null) }', 0],
    ['shadowed namespace', 'import * as R from "react"; function setup(R) { R.forwardRef(() => null) }', 0],
    ['destructured CommonJS forwardRef', 'const { forwardRef } = require("react"); forwardRef(() => null)', 1],
    ['renamed CommonJS forwardRef', 'const { forwardRef: forward } = require("react"); forward(() => null)', 1],
    ['CommonJS member binding', 'const forward = require("react").forwardRef; forward(() => null)', 1],
    ['direct CommonJS member call', 'require("react").forwardRef(() => null)', 1],
    ['CommonJS namespace alias', 'const React = require("react"); const R = React; R.forwardRef(() => null)', 1],
    ['unrelated CommonJS member binding', 'const forward = require("another-library").forwardRef; forward(() => null)', 0],
    ['unrelated direct CommonJS member call', 'require("another-library").forwardRef(() => null)', 0],
    ['unrelated CommonJS namespace alias', 'const React = require("another-library"); const R = React; R.forwardRef(() => null)', 0],
    ['shadowed CommonJS member require', 'function setup(require) { const forward = require("react").forwardRef; forward(() => null) }', 0],
    ['shadowed direct CommonJS require', 'function setup(require) { require("react").forwardRef(() => null) }', 0],
    ['shadowed CommonJS namespace alias', 'const React = require("react"); const R = React; function setup(R) { R.forwardRef(() => null) }', 0],
    ['CommonJS ref parameter present', 'require("react").forwardRef((props, ref) => <div ref={ref} />)', 0],
  ],
  'no-implicit-key': [
    ['direct spread', '<div {...{ key: "value" }} />', 1],
    ['variable spread', 'const props = { key: "value" }; <div {...props} />', 1],
    ['nested spread', 'const keyed = { key: "value" }; const props = { ...keyed }; <div {...props} />', 1],
    ['alias spread', 'const keyed = { key: "value" }; const props = keyed; <div {...props} />', 1],
    ['computed literal key', '<div {...{ ["key"]: "value" }} />', 1],
    ['explicit key', '<div {...{ key: "value" }} key="explicit" />', 0],
    ['explicit key before spread retains legacy exemption', '<div key="explicit" {...{ key: "value" }} />', 0],
    ['non-key spread', '<div {...{ id: "value" }} />', 0],
    ['shadowed spread parameter', 'const props = { key: "value" }; function Probe(props) { return <div {...props} /> }', 0],
    ['cyclic alias terminates', 'const first = second; const second = first; <div {...first} />', 0],
  ],
  'no-use-context': [
    ['direct import and call retain two diagnostics', 'import { useContext } from "react"; useContext(context)', 2],
    ['aliased import retains one diagnostic', 'import { useContext as useReactContext } from "react"; useReactContext(context)', 1],
    ['unused import retains diagnostic', 'import { useContext } from "react"', 1],
    ['namespace call', 'import * as R from "react"; R.useContext(context)', 1],
    ['default namespace call', 'import R from "react"; R.useContext(context)', 1],
    ['use alternative', 'import { use } from "react"; use(context)', 0],
    ['non-React useContext', 'import { useContext } from "another-library"; useContext(context)', 0],
    ['local useContext', 'const useContext = value => value; useContext(context)', 0],
    ['shadowed call does not duplicate import diagnostic', 'import { useContext } from "react"; function Probe(useContext) { return useContext(context) }', 1],
    ['shadowed namespace', 'import * as R from "react"; function Probe(R) { return R.useContext(context) }', 0],
    ['destructured CommonJS useContext', 'const { useContext } = require("react"); useContext(context)', 1],
    ['renamed CommonJS useContext reports the call once', 'const { useContext: useValue } = require("react"); useValue(context)', 1],
  ],
}

const apiFixtures = [
  ['no-prop-types', 'Component', binding => `class Probe extends ${binding} { static propTypes = {} }`],
  ['no-redundant-should-component-update', 'PureComponent', binding => `class Probe extends ${binding} { shouldComponentUpdate() {} }`],
  ['no-useless-forward-ref', 'forwardRef', binding => `${binding}(() => null)`],
  ['no-use-context', 'useContext', binding => `${binding}(context)`],
]

test('compatibility exports only the nine bounded diagnostic rules', () => {
  assert.deepEqual(Object.keys(compat.rules).sort(), Object.keys(severities).sort())
  assert.equal(compat.rules['jsx-uses-react'], undefined)
  assert.equal(compat.rules['jsx-uses-vars'], undefined)
})

for (const [name, cases] of Object.entries(fixtures)) {
  test(`${name} retains diagnostics and rejects unrelated or shadowed controls`, async () => {
    for (const [label, source, expected] of cases)
      assert.equal((await messages(name, source)).length, expected, label)
  })
}

for (const [name, api, use] of apiFixtures) {
  test(`${name} resolves React module and UMD bindings without accepting unrelated or reassigned values`, async () => {
    const cases = [
      ['namespace require', `const R = require("react"); ${use(`R.${api}`)}`, 1],
      ['unrelated namespace require', `const R = require("another-library"); ${use(`R.${api}`)}`, 0],
      ['shadowed require', `function setup(require) { const R = require("react"); ${use(`R.${api}`)} }`, 0],
      ['declared React global', use(`React.${api}`), 1, { React: 'readonly' }],
      ['unbound React global', use(`React.${api}`), 0],
      ['named-default React import', `import { default as R } from "react"; ${use(`R.${api}`)}`, 1],
      ['unrelated named-default import', `import { default as R } from "another-library"; ${use(`R.${api}`)}`, 0],
      ['shadowed named-default import', `import { default as R } from "react"; function setup(R) { ${use(`R.${api}`)} }`, 0],
      ['require alias reassigned before read', `const React = require("react"); let R = React; R = replacement; ${use(`R.${api}`)}`, 0],
      ['require alias reassigned after read', `const React = require("react"); let R = React; ${use(`R.${api}`)}; R = replacement`, 1],
    ]
    for (const [label, source, expected, globals] of cases)
      assert.equal((await messages(name, source, {}, globals)).length, expected, label)
  })
}

test('React version gating and configured import sources remain bounded', async () => {
  const source = 'import { useContext } from "react"; useContext(context)'
  assert.equal((await messages('no-use-context', source, { version: '18.3.1' })).length, 0)
  assert.equal((await messages('no-use-context', source, { version: '19.0.0-rc.1' })).length, 0)
  assert.equal((await messages('no-use-context', source, { version: '19.0.0' })).length, 2)
  assert.equal((await messages('prefer-namespace-import', 'import R from "custom-react"', { importSource: 'custom-react' })).length, 1)
  assert.equal((await messages('no-use-context', 'import { useContext as useValue } from "custom-react"', { importSource: 'custom-react' })).length, 1)
  for (const [name, api, use] of apiFixtures) {
    const settings = { importSource: 'custom-react' }
    assert.equal((await messages(name, `const R = require("custom-react"); ${use(`R.${api}`)}`, settings)).length, 1, `${name}: configured CommonJS namespace`)
    assert.equal((await messages(name, `const R = require("react"); ${use(`R.${api}`)}`, settings)).length, 0, `${name}: unconfigured CommonJS namespace`)
    assert.equal((await messages(name, `const { ${api}: Alias } = require("custom-react"); ${use('Alias')}`, settings)).length, 1, `${name}: configured renamed CommonJS API`)
    assert.equal((await messages(name, `import { default as R } from "custom-react"; ${use(`R.${api}`)}`, settings)).length, 1, `${name}: configured named-default import`)
  }
})

test('primary ESLint still marks JSX identifiers and members used without legacy marker rules', async () => {
  const eslint = new ESLint({ cwd })
  for (const extension of ['jsx', 'tsx']) {
    for (const [source, usedName] of [
      ['const Unused = () => null; const Child = () => <div />; export const Probe = () => <Child />', 'Child'],
      ['const Unused = () => null; const Components = { Child: () => <div /> }; export const Probe = () => <Components.Child />', 'Components'],
    ]) {
      const [result] = await eslint.lintText(source, { filePath: `packages/react/src/marker-probe.${extension}` })
      assert.equal(result.fatalErrorCount, 0, JSON.stringify(result.messages))
      const unused = result.messages.filter(message => message.ruleId?.includes('unused'))
      assert.ok(unused.some(message => message.message.includes('\'Unused\'')), extension)
      assert.ok(!unused.some(message => message.message.includes(`'${usedName}'`)), `${extension}: ${usedName}`)
    }
  }
})
