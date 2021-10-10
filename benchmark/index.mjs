import { exec } from 'child_process'
import { dirname } from 'pathe'

function run(pattner) {
  return new Promise((resolve, reject) => {
    exec(
      `node ./benchmark/${pattner}.mjs`,
      { cwd: dirname('.') },
      (error, stdout) => {
        if (error) {
          return reject(error)
        }
        console.log(stdout)
        resolve()
      }
    )
  })
}

;(async () => {
  try {
    for (const p of ['simple', 'complex']) {
      await run(p)
    }
    // await asyncForEach(['simple', 'complex'], async p => {
    //   await run(p)
    // })
  } catch (e) {
    console.error(e)
  }
})()
