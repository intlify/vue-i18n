import { assign } from '@intlify/shared'
import { generate } from './generator'
import { mangle } from './mangler'
import { optimize } from './optimizer'
import { createParser } from './parser'
import { transform } from './transformer'

import type { CodeGenResult } from './generator'
import type { CompileOptions } from './options'

export type CompilerResult = CodeGenResult

export function baseCompile(
  source: string,
  options: CompileOptions = {}
): CompilerResult {
  const assignedOptions = assign({}, options)
  const jit = !!assignedOptions.jit
  const enableMangle = !!assignedOptions.mangle
  const enableOptimize =
    assignedOptions.optimize == null ? true : assignedOptions.optimize

  // parse source codes
  const parser = createParser(assignedOptions)
  const ast = parser.parse(source)

  // TODO:
  // With the introduction of Jit compilation, code generation is no longer necessary. This function may no longer be needed since tree-shaking is not possible.

  if (!jit) {
    // transform ASTs
    transform(ast, assignedOptions)

    // generate javascript codes
    return generate(ast, assignedOptions)
  } else {
    // optimize ASTs
    enableOptimize && optimize(ast)

    // minimize ASTs
    enableMangle && mangle(ast)

    // In JIT mode, no ast transform, no code generation.
    return { ast, code: '' }
  }
}
