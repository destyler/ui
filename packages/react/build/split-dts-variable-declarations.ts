import ts from 'typescript'

export const splitDtsVariableDeclarations = {
  name: 'split-dts-variable-declarations',
  transform: {
    order: 'pre' as const,
    filter: { id: /\.d\.[cm]?ts$/ },
    handler(code: string, id: string) {
      // The pinned DTS bundler loses later bindings when tree-shaking a
      // declaration such as `declare const Provider: ..., useContext: ...`.
      // Split declaration statements before bundling, retaining normal
      // tree-shaking for both JavaScript and the public declaration graph.
      const source = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true)
      if (!source.statements.some(statement => ts.isVariableStatement(statement) && statement.declarationList.declarations.length > 1))
        return

      const statements = source.statements.flatMap((statement) => {
        if (!ts.isVariableStatement(statement) || statement.declarationList.declarations.length < 2)
          return [statement]

        return statement.declarationList.declarations.map(declaration => ts.factory.updateVariableStatement(
          statement,
          statement.modifiers,
          ts.factory.updateVariableDeclarationList(statement.declarationList, [declaration]),
        ))
      })
      return ts.createPrinter().printFile(ts.factory.updateSourceFile(source, statements))
    },
  },
}
