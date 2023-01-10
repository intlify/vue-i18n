import { promises as fs } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globby } from 'globby'
import yaml from 'js-yaml'

const __dirname = dirname(fileURLToPath(new URL('.', import.meta.url)))

type Deps = {
  name: string
  range: string
  type: string
}
type DepsReviver = (deps: Deps) => Deps | void

async function loadPackage(dir: string) {
  const pkgPath = resolve(dir, 'package.json')
  const data = JSON.parse(await fs.readFile(pkgPath, 'utf-8').catch(() => '{}'))
  const save = () => fs.writeFile(pkgPath, JSON.stringify(data, null, 2) + '\n')
  // const save = () =>
  //   console.log(`package: ${dir}`, JSON.stringify(data, null, 2))

  const updateDeps = (reviver: DepsReviver) => {
    for (const type of [
      'dependencies',
      'devDependencies',
      'optionalDependencies',
      'peerDependencies'
    ]) {
      if (!data[type]) {
        continue
      }
      for (const e of Object.entries(data[type])) {
        const dep = { name: e[0], range: e[1] as string, type }
        delete data[type][dep.name]
        const updated = reviver(dep) || dep
        data[updated.type] = data[updated.type] || {}
        data[updated.type][updated.name] = updated.range
      }
    }
  }

  return {
    dir,
    data,
    save,
    updateDeps
  }
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type Package = ThenArg<ReturnType<typeof loadPackage>>
type WorkspaceData = {
  packages: string[]
}

async function loadWorkspaceData(path: string): Promise<string[]> {
  const workspacesYaml = await fs.readFile(path, 'utf-8')
  const data = (yaml.load(workspacesYaml) as WorkspaceData).packages
  return Array.isArray(data) ? data : []
}

async function loadWorkspace(dir: string, workspaces?: string[]) {
  const workspacePkg = await loadPackage(dir)
  if (workspaces) {
    workspacePkg.data.workspaces = [...workspaces]
  } else {
    const workspacesYaml = await loadWorkspaceData(
      resolve(__dirname, './pnpm-workspace.yaml')
    )
    workspacePkg.data.workspaces = [...workspacesYaml]
  }

  const pkgDirs = await globby(workspacePkg.data.workspaces, {
    onlyDirectories: true
  })

  const packages: Package[] = []

  for (const pkgDir of pkgDirs) {
    const pkg = await loadPackage(pkgDir)
    if (!pkg.data.name) {
      continue
    }
    packages.push(pkg)
  }

  const find = (name: string) => {
    const pkg = packages.find(pkg => pkg.data.name === name)
    if (!pkg) {
      throw new Error('Workspace package not found: ' + name)
    }
    return pkg
  }

  const rename = (from: string, to: string) => {
    find(from).data.name = to
    for (const pkg of packages) {
      pkg.updateDeps(dep => {
        if (dep.name === from && !dep.range.startsWith('npm:')) {
          dep.range = 'npm:' + to + '@' + dep.range
        }
      })
    }
  }

  const setVersion = (name: string, newVersion: string) => {
    find(name).data.version = newVersion
    for (const pkg of packages.filter(p => !p.data.private)) {
      pkg.updateDeps(dep => {
        if (dep.name === name) {
          dep.range = newVersion
        }
      })
    }
  }

  const save = async () => Promise.all(packages.map(pkg => pkg.save()))

  return {
    dir,
    workspacePkg,
    packages,
    save,
    find,
    rename,
    setVersion
  }
}

async function main() {
  const workspace = await loadWorkspace(process.cwd(), ['packages/*'])

  const commit = execSync('git rev-parse --short HEAD').toString('utf-8').trim()
  const release = `${workspace.workspacePkg.data.version}-${commit}`

  for (const pkg of workspace.packages.filter(p => !p.data.private)) {
    workspace.setVersion(pkg.data.name, release)
    const newname = pkg.data.name + '-edge'
    workspace.rename(pkg.data.name, newname)
  }

  await workspace.save()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
