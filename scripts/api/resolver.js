const { getSafePathFromDisplayName } = require('api-docs-gen')

function getContentName(item, customTags) {
  const docs = item.tsdocComment
  if (!docs) {
    return ''
  }
  const modifierTags = docs.modifierTagSet.nodes
    ? docs.modifierTagSet.nodes.map(n => n.tagName)
    : []
  if (modifierTags.length === 0) {
    return ''
  }
  if (!customTags.some(tag => modifierTags.includes(tag))) {
    return ''
  }
  return modifierTags[0].split('@VueI18n')[1].toLowerCase()
}

function resolve(style, item, model, pkg, customTags) {
  const contentName = getContentName(item, customTags)
  let qualifiedName = ''
  for (const hierarchyItem of item.getHierarchy()) {
    const displayName = getSafePathFromDisplayName(hierarchyItem.displayName)
    switch (hierarchyItem.kind) {
      case 'Enum':
      case 'Function':
      case 'Variable':
      case 'TypeAlias':
      case 'Class':
      case 'Interface':
        qualifiedName = displayName
        break
      default:
        break
    }
  }

  if (contentName) {
    if (!qualifiedName) {
      return contentName
    } else {
      return `${contentName}#${qualifiedName}`
    }
  } else {
    if (qualifiedName) {
      return `#${qualifiedName}`
    } else {
      console.warn('cannnot resolve ...')
      return ''
    }
  }
}

module.exports = resolve
