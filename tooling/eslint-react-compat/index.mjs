import { isFunctionComponentNameLoose } from '@eslint-react/core'
import { findAttribute } from '@eslint-react/jsx'
import { getSettingsFromContext } from '@eslint-react/shared'
import { resolve, resolveOrigin } from '@eslint-react/var'

// Diagnostic guards adapted from eslint-plugin-react-x 2.7.2 (MIT).
// Source: npm eslint-plugin-react-x@2.7.2, dist/index.js.
// Upstream: https://github.com/Rel1cx/eslint-react (plugins/eslint-plugin-react-x).
// Keep this bounded bridge separate from the current React 5 policy.
// Deliberate differences: no legacy autofixes; API/class checks require an ESM or
// CommonJS React binding, or an explicitly configured React namespace global.
// Unbound or unrelated same-name globals are not treated as React APIs.
// Current findAttribute additionally understands alias/computed-key spreads.
const isFunction = node => ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node?.type)
const report = (context, node) => context.report({ node, messageId: 'default' })
const rule = (message, create) => ({ meta: { type: 'problem', schema: [], messages: { default: message } }, create })

function propertyName(node) {
  return node.computed ? node.property.type === 'Literal' ? node.property.value : undefined : node.property.name
}

function variableFor(context, node) {
  for (let scope = context.sourceCode.getScope(node); scope; scope = scope.upper) {
    if (scope.set.has(node.name))
      return scope.set.get(node.name)
  }
}

function reactBinding(context, node, seen = new Set()) {
  if (!node || seen.has(node))
    return
  seen.add(node)
  const { importSource } = getSettingsFromContext(context)
  if (node.type === 'CallExpression' && node.callee.type === 'Identifier'
    && node.callee.name === 'require' && !variableFor(context, node.callee)?.defs.length
    && node.arguments.length === 1 && node.arguments[0].type === 'Literal'
    && node.arguments[0].value === importSource) {
    return '*'
  }
  if (node.type === 'MemberExpression' && reactBinding(context, node.object, seen) === '*')
    return propertyName(node)
  if (node.type !== 'Identifier')
    return
  const variable = variableFor(context, node)
  // Do not trust an initializer after a preceding write to the same binding.
  if (variable?.references.some(reference => reference.isWrite() && !reference.init
    && reference.identifier.range[0] < node.range[0])) {
    return
  }
  const definition = variable?.defs[0]?.node
  if (!definition) {
    // A declared React global is intentional UMD usage, unlike an unbound name.
    if (node.name === 'React' && variable && context.languageOptions.globals?.React !== 'off')
      return '*'
    return
  }
  if (['ImportDefaultSpecifier', 'ImportNamespaceSpecifier', 'ImportSpecifier'].includes(definition.type)
    && definition.parent.source.value === importSource) {
    const imported = definition.type === 'ImportSpecifier' ? definition.imported.name ?? definition.imported.value : 'default'
    return imported === 'default' ? '*' : imported
  }
  if (definition.type !== 'VariableDeclarator')
    return
  const binding = reactBinding(context, definition.init, seen)
  if (definition.id.type === 'Identifier')
    return binding
  if (definition.id.type === 'ObjectPattern' && binding === '*') {
    const property = definition.id.properties.find(property => property.type === 'Property'
      && property.value.type === 'Identifier' && property.value.name === node.name)
    return property && (property.computed ? property.key.value : property.key.name ?? property.key.value)
  }
}

function isReactApi(context, node, name) {
  return reactBinding(context, node) === name
}

function isReactClass(context, node, pureOnly = false) {
  return isReactApi(context, node?.superClass, 'PureComponent')
    || (!pureOnly && isReactApi(context, node?.superClass, 'Component'))
}

function assignedComponent(context, node, name) {
  if (node.operator !== '=' || node.left.type !== 'MemberExpression')
    return
  const { object, property } = node.left
  if (object.type !== 'Identifier' || property.type !== 'Identifier' || property.name !== name
    || !isFunctionComponentNameLoose(object.name)) {
    return
  }
  // resolve, unlike resolveOrigin, does not treat parameters as their containing function.
  return resolve(context, object)
}

function isReact19(context) {
  const [release, prerelease] = getSettingsFromContext(context).version.split('-')
  const [major, minor = 0, patch = 0] = release.split('.').map(Number)
  return major > 19 || (major === 19 && (minor > 0 || patch > 0 || !prerelease))
}

export default {
  meta: { name: '@destyler-ui/eslint-react-compat', version: '0.0.0' },
  rules: {
    'jsx-no-duplicate-props': rule('This JSX property is assigned multiple times.', context => ({
      JSXOpeningElement(node) {
        const names = new Set()
        for (const attribute of node.attributes) {
          if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier')
            continue
          if (names.has(attribute.name.name))
            report(context, attribute)
          names.add(attribute.name.name)
        }
      },
    })),
    'prefer-namespace-import': rule('Prefer importing React with a namespace import.', context => ({
      ImportDeclaration(node) {
        if (node.source.value !== getSettingsFromContext(context).importSource)
          return
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier')
            report(context, node.specifiers.length === 1 ? node : specifier)
        }
      },
    })),
    'no-default-props': rule('[Deprecated] Use ES6 default parameters instead.', context => ({
      AssignmentExpression(node) {
        if (isFunction(assignedComponent(context, node, 'defaultProps')))
          report(context, node.left.property)
      },
    })),
    'no-prop-types': rule('[Deprecated] Use TypeScript or another type-checking solution instead.', context => ({
      AssignmentExpression(node) {
        const component = assignedComponent(context, node, 'propTypes')
        if (isFunction(component) || isReactClass(context, component))
          report(context, node.left.property)
      },
      PropertyDefinition(node) {
        if (node.static && node.key.type === 'Identifier' && node.key.name === 'propTypes'
          && isReactClass(context, node.parent.parent)) {
          report(context, node)
        }
      },
    })),
    'no-redundant-should-component-update': rule('PureComponent does not need shouldComponentUpdate.', (context) => {
      function check(node) {
        if (!isReactClass(context, node, true))
          return
        for (const member of node.body.body) {
          if (['MethodDefinition', 'PropertyDefinition'].includes(member.type)
            && member.key.type === 'Identifier' && member.key.name === 'shouldComponentUpdate') {
            report(context, member)
          }
        }
      }
      return { ClassDeclaration: check, ClassExpression: check }
    }),
    'no-string-refs': rule('[Deprecated] Use callback refs instead.', context => ({
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'ref')
          return
        const value = node.value?.type === 'JSXExpressionContainer' ? node.value.expression : node.value
        if (value?.type === 'TemplateLiteral' || (value?.type === 'Literal' && typeof value.value === 'string'))
          report(context, node)
      },
    })),
    'no-useless-forward-ref': rule('A forwardRef component must accept a ref parameter.', context => ({
      CallExpression(node) {
        if (isReactApi(context, node.callee, 'forwardRef') && isFunction(node.arguments[0])
          && node.arguments[0].params.length < 2) {
          report(context, node.callee)
        }
      },
    })),
    'no-implicit-key': rule('Do not use implicit key props.', context => ({
      JSXOpeningElement(node) {
        if (node.attributes.some(attribute => attribute.type === 'JSXAttribute' && attribute.name.name === 'key'))
          return
        const key = findAttribute(context, node.parent, 'key')
        if (key)
          report(context, key)
      },
    })),
    'no-use-context': rule('In React 19, use is preferred over useContext because it is more flexible.', (context) => {
      if (!isReact19(context))
        return {}
      return {
        ImportDeclaration(node) {
          if (node.source.value !== getSettingsFromContext(context).importSource)
            return
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'useContext')
              report(context, specifier)
          }
        },
        CallExpression(node) {
          // Legacy reports the import, not each aliased identifier call.
          if (node.callee.type === 'Identifier' && node.callee.name !== 'useContext'
            && resolveOrigin(context, node.callee)?.type === 'ImportSpecifier') {
            return
          }
          if (isReactApi(context, node.callee, 'useContext'))
            report(context, node.callee)
        },
      }
    }),
  },
}
