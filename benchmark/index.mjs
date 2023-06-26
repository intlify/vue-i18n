import { spawn } from 'child_process'

function run(pattner) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [`./benchmark/${pattner}.mjs`], {
      stdio: 'inherit'
    })

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

;(async () => {
  try {
    for (const p of [
      'compile',
      'simple',
      'simple-jit',
      'complex',
      'complex-jit'
    ]) {
      await run(p)
      console.log()
    }
  } catch (e) {
    console.error(e)
  }
})()
