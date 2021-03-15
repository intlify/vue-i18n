import { CompileOptions } from './options'
import { createParser } from './parser'
import { transform } from './transformer'
import { generate, CodeGenResult } from './generator'
import { assign } from '@intlify/shared'

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
