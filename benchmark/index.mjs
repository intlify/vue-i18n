import { spawn } from 'node:child_process'
import { parseArgs } from './utils.mjs'

const args = parseArgs()

function run(pattner) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'node',
      ['--expose-gc', `./benchmark/${pattner}.mjs`, '--format', args.format],
      {
        stdio: 'inherit'
      }
    )

    child.once('error', err => {
      reject(err)
    })

    child.once('exit', code => {
      if (code !== 0) {
        reject(new Error(`exit with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}

try {
  for (const p of [
    'compile',
    'simple',
    'simple-jit',
    'simple-jit-aot',
    'complex',
    'complex-jit',
    'complex-jit-aot'
  ]) {
    await run(p)
    console.log()
  }
} catch (e) {
  console.error(e)
}
