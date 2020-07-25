import { CompileOptions } from './options'
import { ResourceNode, createParser } from './parser'
import { transform } from './transformer'
import { generate } from './generator'
import { CompileError, defaultOnError } from './errors'
import { MessageFunction, MessageFunctions } from './runtime'
import { warn, format, isBoolean } from '../utils'

export interface CompileResult {
  code: string
  ast: ResourceNode
  // TODO: should be implemetend sourcemap
  // map?: RawSourceMap
}

const RE_HTML_TAG = /<\/?[\w\s="/.':;#-\/]+>/
const WARN_MESSAGE = `Detected HTML in '{source}' message. Recommend not using HTML messages to avoid XSS.`

function checkHtmlMessage(source: string, options: CompileOptions): void {
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage)
    ? options.warnHtmlMessage
    : true
  if (warnHtmlMessage && RE_HTML_TAG.test(source)) {
    warn(format(WARN_MESSAGE, { source }))
  }
}

const defaultOnCacheKey = (source: string): string => source
let compileCache: unknown = Object.create(null)

export function clearCompileCache(): void {
  compileCache = Object.create(null)
}

export function baseCompile(
  source: string,
  options: CompileOptions = {}
): CompileResult {
  // parse source codes
  const parser = createParser({ ...options })
  const ast = parser.parse(source)

  // transform ASTs
  transform(ast, { ...options })

  // generate javascript codes
  const code = generate(ast, { ...options })

  return { ast, code }
}

export function compile<T = string>(
  source: string,
  options: CompileOptions = {}
): MessageFunction<T> {
  // check HTML message
  __DEV__ && checkHtmlMessage(source, options)

  // check caches
  const onCacheKey = options.onCacheKey || defaultOnCacheKey
  const key = onCacheKey(source)
  const cached = (compileCache as MessageFunctions<T>)[key]
  if (cached) {
    return cached
  }

  // compile error detecting
  let occured = false
  const onError = options.onError || defaultOnError
  options.onError = (err: CompileError): void => {
    occured = true
    onError(err)
  }

  // compile
  const { code } = baseCompile(source, options)

  // evaluate function
  const msg = new Function(`return ${code}`)() as MessageFunction<T>

  // if occured compile error, don't cache
  return !occured ? ((compileCache as MessageFunctions<T>)[key] = msg) : msg
}
