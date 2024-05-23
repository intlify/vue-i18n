module.exports = {
  rules: {
    'no-start-duplicated-conjunction': {
      interval: 2
    },
    'max-comma': true, // default 4
    'no-empty-section': false, // TODO: later
    terminology: {},
    'period-in-list-item': true,
    'no-surrogate-pair': false,
    '@textlint-rule/no-unmatched-pair': true,
    'max-doc-width': 360,
    'unexpanded-acronym': {
      ignore_acronyms: [
        'JIT',
        'AOT',
        'UMD',
        'NPM',
        'CDN',
        'URL',
        'WIP',
        'NOTE',
        'DOM',
        'XSS',
        'HTML',
        'TODO',
        'API',
        'ECMA',
        'MEMO',
        'YAML',
        'JSON5',
        'HTTP',
        'CLI',
        'ICU',
        'CSP',
        'SFC',
        'PHP',
        'SSR',
        'MIT',
        'PNPM'
      ]
    },
    'abbr-within-parentheses': true,
    'common-misspellings': true,
    apostrophe: true,
    diacritics: true,
    'stop-words': false, // TODO: later
    'write-good': false, // TODO: laster
    'en-capitalization': {
      allowFigures: false,
      allowHeading: false,
      allowLists: false
    }
  },
  filters: {
    comments: true
  }
}
