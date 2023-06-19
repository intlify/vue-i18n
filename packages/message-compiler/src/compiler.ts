import { createParser } from './parser'
import { transform } from './transformer'
import { generate } from './generator'
import { assign } from '@intlify/shared'

import type { CompileOptions } from './options'
import type { CodeGenResult } from './generator'

export function baseCompile(
  source: string,
  options: CompileOptions = {}
): CodeGenResult {
  const assignedOptions = assign({}, options)

  // parse source codes
  const parser = createParser(assignedOptions)
  const ast = parser.parse(source)

  // transform ASTs
  transform(ast, assignedOptions)

  // generate javascript codes
  return generate(ast, assignedOptions)
}
