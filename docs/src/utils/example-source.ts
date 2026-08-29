import type { FrameworkDefinition } from '../config/frameworks'
import path from 'node:path'
import { getFrameworkSourceAliasPath } from '../config/frameworks'

export function getExampleSourcePath(
  workspaceRoot: string,
  framework: FrameworkDefinition,
  component: string,
  example: string,
): string {
  return path.join(
    workspaceRoot,
    framework.sourceDirectory,
    component,
    'examples',
    `${example}.${framework.extension}`,
  )
}

export function rewriteExampleSourceImports(
  code: string,
  framework: FrameworkDefinition,
  sourcePath: string,
): string {
  const examplesDirectory = path.dirname(sourcePath)

  return code.replace(/(from\s+)(['"])([^'"]+)\2/g, (statement, prefix, quote, specifier) => {
    if (getFrameworkSourceAliasPath(framework, specifier) !== null)
      return `${prefix}${quote}${framework.packageName}${quote}`

    if (!specifier.startsWith('.'))
      return statement

    const resolvedImport = path.resolve(examplesDirectory, specifier)
    const isLocalExampleDependency = resolvedImport === examplesDirectory
      || resolvedImport.startsWith(`${examplesDirectory}${path.sep}`)

    return isLocalExampleDependency
      ? statement
      : `${prefix}${quote}${framework.packageName}${quote}`
  })
}

export function formatExampleSourceComment(
  framework: FrameworkDefinition,
  message: string,
): string {
  return framework.commentStyle === 'html'
    ? `<!-- ${message} -->`
    : `// ${message}`
}
