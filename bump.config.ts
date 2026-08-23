import { defineConfig } from 'bumpp'
import { updateChangelog } from 'gh-changelogen'

export default defineConfig({
  files: ['package.json', 'packages/**/package.json'],
  all: true,
  commit: 'release: v%s',
  tag: true,
  push: true,
  execute: async operation => {
    await updateChangelog({
      repository: 'intlify/vue-i18n',
      tagName: `v${operation.state.newVersion}`,
      source: 'generated-notes',
      targetCommitish: 'HEAD',
      output: 'CHANGELOG.md'
    })
  }
})
