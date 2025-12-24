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
}
