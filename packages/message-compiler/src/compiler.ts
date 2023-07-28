import { createParser } from './parser'
import { transform } from './transformer'
import { optimize } from './optimizer'
import { minify } from './minifier'
import { generate } from './generator'
import { assign } from '@intlify/shared'

import type { CompileOptions } from './options'
import type { CodeGenResult } from './generator'

export type CompilerResult = CodeGenResult

export function baseCompile(
  source: string,
  options: CompileOptions = {}
): CompilerResult {
  const assignedOptions = assign({}, options)
  const jit = !!assignedOptions.jit
  const enalbeMinify = !!assignedOptions.minify
  const enambeOptimize =
    assignedOptions.optimize == null ? true : assignedOptions.optimize

  // parse source codes
  const parser = createParser(assignedOptions)
  const ast = parser.parse(source)

  if (!jit) {
    // transform ASTs
    transform(ast, assignedOptions)

    // generate javascript codes
    return generate(ast, assignedOptions)
  } else {
    // optimize ASTs
    enambeOptimize && optimize(ast)

    // minimize ASTs
    enalbeMinify && minify(ast)

    // In JIT mode, no ast transform, no code generation.
    return { ast, code: '' }
  }
}
