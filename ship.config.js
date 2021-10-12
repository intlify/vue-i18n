import execa from 'execa'
import path from 'path'
import { promises as fs } from 'fs'

const dirname = path.dirname(new URL(import.meta.url).pathname)

async function readJson(target) {
  const file = await fs.readFile(target, 'utf8')
  return JSON.parse(file)
}

function extractSpecificChangelog(changelog, version) {
  if (!changelog) {
    return null
  }
  const escapedVersion = version.replace(/\./g, '\\.')
  const regex = new RegExp(
    `(#+?\\s\\[?v?${escapedVersion}\\]?[\\s\\S]*?)(#+?\\s\\[?v?\\d+?\\.\\d+?\\.\\d+?\\]?)`,
    'g'
  )
  const matches = regex.exec(changelog)
  return matches ? matches[1] : null
}

async function commitChangelog(current, next) {
  const { stdout } = await execa('npx', [
    'lerna-changelog',
    '--next-version',
    `v${next}`
  ])
  const escapedVersion = next.replace(/\./g, '\\.')
  const regex = new RegExp(
    `(#+?\\s\\[?v?${escapedVersion}\\]?[\\s\\S]*?)(#+?\\s\\[?v?\\d\\.\\d\\.\\d\\]?)`,
    'g'
  )
  const matches = regex.exec(stdout.toString())
  const head = matches ? matches[1] : stdout
  const changelog = await fs.readFile('./CHANGELOG.md', 'utf8')
  return fs.writeFile('./CHANGELOG.md', `${head}\n\n${changelog}`)
}

export default {
  mergeStrategy: { toSameBranch: ['master'] },
  monorepo: {
    mainVersionFile: 'package.json',
    packagesToBump: [
      'packages/shared',
      'packages/message-compiler',
      'packages/core-base',
      'packages/core',
      'packages/devtools-if',
      'packages/vue-devtools',
      'packages/vue-i18n-core',
      'packages/vue-i18n',
      'packages/petite-vue-i18n',
      'packages/vue-i18n-bridge'
    ],
    packagesToPublish: [
      'packages/shared',
      'packages/message-compiler',
      'packages/core-base',
      'packages/core',
      'packages/devtools-if',
      'packages/vue-devtools',
      'packages/vue-i18n-core',
      'packages/vue-i18n',
      'packages/petite-vue-i18n',
      'packages/vue-i18n-bridge'
    ]
  },
  updateChangelog: false,
  installCommand: () => 'pnpm install --silent',
  buildCommand: ({ isYarn, version }) => 'pnpm build:type',
  beforeCommitChanges: async ({ nextVersion, exec, dir }) => {
    const pkg = await readJson(path.resolve(dirname, './package.json'))
    await commitChangelog(pkg.version, nextVersion)
    await exec('pnpm format:package')
  },
  formatCommitMessage: ({ version, releaseType, mergeStrategy, baseBranch }) =>
    `${releaseType} release v${version}`,
  formatPullRequestTitle: ({ version, releaseType }) =>
    `${releaseType} release v${version}`,
  shouldRelease: () => true,
  releases: {
    extractChangelog: async ({ version, dir }) => {
      const changelogPath = path.resolve(dir, 'CHANGELOG.md')
      try {
        const changelogFile = (
          await fs.readFile(changelogPath, 'utf-8')
        ).toString()
        const ret = extractSpecificChangelog(changelogFile, version)
        return ret
      } catch (err) {
        if (err.code === 'ENOENT') {
          return null
        }
        throw err
      }
    }
  }
}
