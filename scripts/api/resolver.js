const { getSafePathFromDisplayName } = require('api-docs-gen')

function resolve(style, item, model, pkg) {
  let baseName = ''
  for (const hierarchyItem of item.getHierarchy()) {
    const qualifiedName = getSafePathFromDisplayName(hierarchyItem.displayName)
    switch (hierarchyItem.kind) {
      case 'Enum':
      case 'Function':
      case 'Variable':
      case 'TypeAlias':
      case 'Class':
      case 'Interface':
        baseName = `#${qualifiedName}`
        break
      default:
        break
    }
  }
  return baseName
}

module.exports = resolve
