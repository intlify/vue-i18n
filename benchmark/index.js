const exec = require('child_process').exec

function run(pattner) {
  return new Promise((resolve, reject) => {
    exec(`node ./${pattner}.js`, { cwd: __dirname }, (error, stdout) => {
      if (error) {
        return reject(error)
      }
      console.log(stdout)
      resolve()
    })
  })
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

;(async () => {
  try {
    await asyncForEach(['simple', 'complex'], async p => {
      await run(p)
    })
  } catch (e) {
    console.error(e)
  }
})()
