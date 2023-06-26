import { createParser } from './parser'
import { transform } from './transformer'
import { optimize } from './optimizer'
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
  const useJIT = !!assignedOptions.useJIT
  const doOptimize =
    assignedOptions.optimize == null ? true : assignedOptions.optimize

  // parse source codes
  const parser = createParser(assignedOptions)
  const ast = parser.parse(source)

  if (!useJIT) {
    // transform ASTs
    transform(ast, assignedOptions)

    // optimize ASTs
    doOptimize && optimize(ast)

    // generate javascript codes
    return generate(ast, assignedOptions)
  } else {
    // optimize ASTs
    doOptimize && optimize(ast)

    // In JIT mode, no ast transform, no code generation.
    return { ast, code: '' }
  }
}
