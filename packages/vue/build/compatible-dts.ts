import ts from 'typescript'

export const compatibleDts = {
  name: 'compatible-vue-declarations',
  transform: {
    order: 'pre' as const,
    filter: { id: /\.d\.[cm]?ts$/ },
    handler(code: string, id: string) {
      // The pinned DTS bundler loses later bindings when tree-shaking a
      // declaration such as `declare const Provider: ..., useContext: ...`.
      // Split declaration statements before bundling, retaining normal
      // tree-shaking for both JavaScript and the public declaration graph.
      const source = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true)
      const vueNamespaces = new Set(source.statements.flatMap((statement) => {
        if (!ts.isImportDeclaration(statement)
          || !ts.isStringLiteral(statement.moduleSpecifier)
          || statement.moduleSpecifier.text !== 'vue') {
          return []
        }
        const binding = statement.importClause?.namedBindings
        return binding && ts.isNamespaceImport(binding) ? [binding.name.text] : []
      }))
      const statements = source.statements.flatMap((statement) => {
        if (!ts.isVariableStatement(statement) || statement.declarationList.declarations.length < 2)
          return [statement]

        return statement.declarationList.declarations.map(declaration => ts.factory.updateVariableStatement(
          statement,
          statement.modifiers,
          ts.factory.updateVariableDeclarationList(statement.declarationList, [declaration]),
        ))
      })
      // Current Vue declarations have a twentieth DefineComponent argument (TypeEl). All
      // generated SFC declarations use its default `any`, so omitting only
      // that default preserves their meaning and Vue 3.5.0 compatibility.
      const result = ts.transform(ts.factory.updateSourceFile(source, statements), [(context) => {
        const visit: ts.Visitor = (node) => {
          if (ts.isImportTypeNode(node)
            && ts.isLiteralTypeNode(node.argument)
            && ts.isStringLiteral(node.argument.literal)
            && node.argument.literal.text === 'vue'
            && node.qualifier && ts.isIdentifier(node.qualifier)
            && node.qualifier.text === 'DefineComponent'
            && node.typeArguments?.length === 20
            && node.typeArguments[19].kind === ts.SyntaxKind.AnyKeyword) {
            return ts.factory.updateImportTypeNode(node, node.argument, node.attributes, node.qualifier, node.typeArguments.slice(0, 19), node.isTypeOf)
          }
          if (ts.isTypeReferenceNode(node)
            && ts.isQualifiedName(node.typeName)
            && ts.isIdentifier(node.typeName.left)
            && vueNamespaces.has(node.typeName.left.text)
            && node.typeName.right.text === 'DefineComponent'
            && node.typeArguments?.length === 20
            && node.typeArguments[19].kind === ts.SyntaxKind.AnyKeyword) {
            return ts.factory.updateTypeReferenceNode(node, node.typeName, node.typeArguments.slice(0, 19))
          }
          return ts.visitEachChild(node, visit, context)
        }
        return sourceFile => ts.visitNode(sourceFile, visit) as ts.SourceFile
      }])
      try {
        return ts.createPrinter().printFile(result.transformed[0])
      }
      finally {
        result.dispose()
      }
    },
  },
}
