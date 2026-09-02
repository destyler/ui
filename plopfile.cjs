const path = require('node:path')
const {
  defaultDisplayName,
  defaultNamespace,
  generateComponent,
  readManifest,
  validateDisplayName,
  validateNamespace,
  validateSlug,
} = require('./packages/svelte/scripts/package-manifest.cjs')

function camelCase(str) {
  return str.replace(/[-_]([a-z])/g, g => g[1].toUpperCase())
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function multiCapitalize(str) {
  return str.split('-').map(capitalize).join(' ')
}

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
  plop.setHelper('camelize', camelCase)
  plop.setHelper('capitalize', capitalize)
  plop.setHelper('multiCapitalize', multiCapitalize)
  plop.setActionType('svelte-component', (answers, _config, plopApi) => generateComponent({
    answers,
    plopApi,
    templateRoot: path.resolve(__dirname, 'template/svelte'),
  }))

  plop.setGenerator('vue', {
    description: 'Generates a new Vue component',
    prompts: [
      {
        type: 'input',
        name: 'vue',
        message: 'Enter component name (e.g. avatar, otp-input):',
      },
    ],
    actions(answers) {
      const actions = []

      if (!answers)
        return actions

      const { vue } = answers

      actions.push({
        type: 'addMany',
        templateFiles: 'template/vue/**',
        destination: `packages/vue/src/components/{{dashCase vue}}`,
        base: 'template/vue/',
        data: { vue, name: vue },
        abortOnFail: true,
      })

      return actions
    },
  })

  plop.setGenerator('react', {
    description: 'Generates a new React component',
    prompts: [
      {
        type: 'input',
        name: 'react',
        message: 'Enter component name (e.g. avatar, otp-input):',
      },
    ],
    actions(answers) {
      const actions = []

      if (!answers)
        return actions

      const { react } = answers

      actions.push({
        type: 'addMany',
        templateFiles: 'template/react/**',
        destination: `packages/react/src/components/{{dashCase react}}`,
        base: 'template/react/',
        data: { react, name: react },
        abortOnFail: true,
      })

      return actions
    },
  })

  plop.setGenerator('solid', {
    description: 'Generates a new Solid component',
    prompts: [
      {
        type: 'input',
        name: 'solid',
        message: 'Enter component name (e.g. avatar, otp-input):',
      },
    ],
    actions(answers) {
      const actions = []

      if (!answers)
        return actions

      const { solid } = answers

      actions.push({
        type: 'addMany',
        templateFiles: 'template/solid/**',
        destination: `packages/solid/src/components/{{dashCase solid}}`,
        base: 'template/solid/',
        data: { solid, name: solid },
        abortOnFail: true,
      })

      return actions
    },
  })

  plop.setGenerator('svelte', {
    description: 'Generates a state-machine-free Svelte component scaffold and updates its manifest',
    prompts: [
      {
        type: 'input',
        name: 'svelte',
        message: 'Enter a new component slug (e.g. date-picker):',
        filter: value => value.trim(),
        validate: value => validateSlug(value),
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter the display name:',
        default: answers => defaultDisplayName(answers.svelte),
        filter: value => value.trim(),
        validate: value => validateDisplayName(value),
      },
      {
        type: 'input',
        name: 'namespace',
        message: 'Enter the exported namespace:',
        default: answers => defaultNamespace(answers.svelte),
        filter: value => value.trim(),
        validate: value => validateNamespace(value),
      },
      {
        type: 'list',
        name: 'category',
        message: 'Select the component category:',
        choices: readManifest().componentCategories,
      },
    ],
    actions(answers) {
      const actions = []

      if (!answers)
        return actions

      actions.push({
        type: 'svelte-component',
        abortOnFail: true,
      })

      return actions
    },
  })
}
