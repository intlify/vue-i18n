import { CompileOptions } from './options'
import { createParser } from './parser'
import { transform } from './transformer'
import { generate, CodeGenResult } from './generator'

export function baseCompile(
  source: string,
  options: CompileOptions = {}
): CodeGenResult {
  // parse source codes
  const parser = createParser({ ...options })
  const ast = parser.parse(source)

  // transform ASTs
  transform(ast, { ...options })

  // generate javascript codes
  return generate(ast, { ...options })
}
