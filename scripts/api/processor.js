const {
  getDocSectionContent,
  escapeText,
  findCustomTags,
  ContentBuilder
} = require('api-docs-gen')

function process(model, pkg, style, resolver, customTags) {
  // console.log('custom process', model, pkg, style, customTags)
  const items = pkg.members[0] ? pkg.members[0].members : []
  const models = []
  for (const item of items) {
    const { kind } = item
    switch (kind) {
      case 'Function':
        models.push(
          parseFunction(style, model, pkg, resolver, item, customTags)
        )
        break
      case 'Enum':
        models.push(parseEnum(style, model, pkg, resolver, item, customTags))
        break
      case 'Interface':
        models.push(
          parseInterface(style, model, pkg, resolver, item, customTags)
        )
        break
      case 'Class':
        break
      case 'TypeAlias':
        models.push(
          parseTypeAlias(style, model, pkg, resolver, item, customTags)
        )
        break
      case 'Variable':
        models.push(
          parseVariable(style, model, pkg, resolver, item, customTags)
        )
        break
      default:
        break
    }
  }

  const generalModels = models.filter(m => m.modifierTags && m.modifierTags.includes('@VueI18nGeneral'))
  const legacyModels = models.filter(m => m.modifierTags && m.modifierTags.includes('@VueI18nLegacy'))
  const compositionModels = models.filter(m => m.modifierTags && m.modifierTags.includes('@VueI18nComposition'))
  const miscModels = models.filter(m => m.modifierTags && m.modifierTags.length === 0)

  return ''
}

function parseFunction(style, model, pkg, resolver, item, customTags) {
  const genModel = {
    name: item.displayName,
    type: item.kind
  }

  const docs = item.tsdocComment
  if (!docs) {
    return genModel
  }

  // modifierTags
  genModel.modifierTags = docs.modifierTagSet.nodes
    ? docs.modifierTagSet.nodes.map(n => n.tagName)
    : []

  // sumarry
  if (docs.summarySection) {
    genModel.summary = getDocSectionContent(
      model,
      pkg,
      docs.summarySection,
      item,
      style,
      resolver,
      customTags
    )
  }

  // signature
  if (item.excerptTokens) {
    genModel.signature = item.excerptTokens.map(token => token.text).join('')
  }

  // parameters
  if (item.parameters) {
    genModel.parameters = []
    for (const p of item.parameters) {
      genModel.parameters.push({
        name: p.name,
        type: escapeText(p.parameterTypeExcerpt.text.trim()),
        description:
          p.tsdocParamBlock && p.tsdocParamBlock.content
            ? getDocSectionContent(
                model,
                pkg,
                p.tsdocParamBlock.content,
                item,
                style,
                resolver,
                customTags
              )
            : ''
      })
    }
  }

  // returns
  if (docs.returnsBlock) {
    genModel.returns = getDocSectionContent(
      model,
      pkg,
      docs.returnsBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  }

  // throws
  const throws = findCustomTags(docs.customBlocks, '@throws')
  if (throws.length > 0) {
    genModel.throws = []
    for (const t of throws) {
      genModel.throws.push(
        getDocSectionContent(
          model,
          pkg,
          t.content,
          item,
          style,
          resolver,
          customTags
        )
      )
    }
  }

  // remarks
  if (docs.remarksBlock) {
    genModel.remarks = getDocSectionContent(
      model,
      pkg,
      docs.remarksBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  }

  // examples
  const examples = findCustomTags(docs.customBlocks, '@example')
  if (examples.length > 0) {
    genModel.examples = []
    for (const e of examples) {
      genModel.examples.push(
        getDocSectionContent(
          model,
          pkg,
          e.content,
          item,
          style,
          resolver,
          customTags
        )
      )
    }
  }

  // console.log('function genmodel', genModel)
  return genModel
}

function parseEnum(style, model, pkg, resolver, item, customTags) {
  const genModel = {
    name: item.displayName,
    type: item.kind
  }

  const docs = item.tsdocComment
  if (!docs) {
    return genModel
  }

  // modifierTags
  genModel.modifierTags = docs.modifierTagSet.nodes
    ? docs.modifierTagSet.nodes.map(n => n.tagName)
    : []

  // sumarry
  if (docs.summarySection) {
    genModel.summary = getDocSectionContent(
      model,
      pkg,
      docs.summarySection,
      item,
      style,
      resolver,
      customTags
    )
  }

  // signature
  if (item.excerptTokens) {
    genModel.signature = item.excerptTokens.map(token => token.text).join('')
  }

  // remarks
  if (docs.remarksBlock) {
    genModel.remarks = getDocSectionContent(
      model,
      pkg,
      docs.remarksBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  }

  // members
  if (item.members) {
    genModel.members = []
    for (const m of item.members) {
      genModel.members.push({
        member: m.displayName,
        value: m.initializerExcerpt.text,
        description:
          m.tsdocComment && m.tsdocComment.summarySection
            ? getDocSectionContent(
                model,
                pkg,
                m.tsdocComment.summarySection,
                item,
                style,
                resolver,
                customTags
              )
            : ''
      })
    }
  }

  // examples
  const examples = findCustomTags(docs.customBlocks, '@example')
  if (examples.length > 0) {
    genModel.examples = []
    for (const e of examples) {
      genModel.examples.push(
        getDocSectionContent(
          model,
          pkg,
          e.content,
          item,
          style,
          resolver,
          customTags
        )
      )
    }
  }

  // console.log('enum genmodel', genModel)
  return genModel
}

function parseContentForClassinizable(
  style,
  model,
  pkg,
  resolver,
  item,
  type,
  customTags
) {
  const genModel = {
    name: item.displayName,
    type: item.kind
  }

  const docs = item.tsdocComment
  if (!docs) {
    return genModel
  }

  // modifierTags
  genModel.modifierTags = docs.modifierTagSet.nodes
    ? docs.modifierTagSet.nodes.map(n => n.tagName)
    : []

  // sumarry
  if (docs.summarySection) {
    genModel.summary = getDocSectionContent(
      model,
      pkg,
      docs.summarySection,
      item,
      style,
      resolver,
      customTags
    )
  }

  // signature
  if (item.excerptTokens) {
    genModel.signature = item.excerptTokens.map(token => token.text).join('')
  }

  // remarks
  if (docs.remarksBlock) {
    genModel.remarks = getDocSectionContent(
      model,
      pkg,
      docs.remarksBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  }

  // parameters
  if ((type === 'constrcutor' || type === 'method') && item.parameters) {
    genModel.parameters = []
    for (const p of item.parameters) {
      genModel.parameters.push({
        name: p.name,
        type: escapeText(p.parameterTypeExcerpt.text.trim()),
        description:
          p.tsdocParamBlock && p.tsdocParamBlock.content
            ? getDocSectionContent(
                model,
                pkg,
                p.tsdocParamBlock.content,
                item,
                style,
                resolver,
                customTags
              )
            : ''
      })
    }
  }

  // returns
  if (type === 'method' && docs.returnsBlock) {
    genModel.returns = getDocSectionContent(
      model,
      pkg,
      docs.returnsBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  }

  // throws
  const throws = findCustomTags(docs.customBlocks, '@throws')
  if ((type === 'constructor' || type === 'method') && throws.length > 0) {
    genModel.throws = []
    for (const t of throws) {
      genModel.throws.push(
        getDocSectionContent(
          model,
          pkg,
          t.content,
          item,
          style,
          resolver,
          customTags
        )
      )
    }
  }

  // examples
  const examples = findCustomTags(docs.customBlocks, '@example')
  if (examples.length > 0) {
    genModel.examples = []
    for (const e of examples) {
      genModel.examples.push(
        getDocSectionContent(
          model,
          pkg,
          e.content,
          item,
          style,
          resolver,
          customTags
        )
      )
    }
  }

  return genModel
}

function parseInterface(style, model, pkg, resolver, item, customTags) {
  const genModel = parseContentForClassinizable(
    style,
    model,
    pkg,
    resolver,
    item,
    'interface',
    customTags
  )

  const methods = item.members.filter(m => m.kind === 'MethodSignature')
  if (methods.length > 0) {
    genModel.methods = []
    for (const method of methods) {
      genModel.methods.push(
        parseContentForClassinizable(
          style,
          model,
          pkg,
          resolver,
          method,
          'method',
          customTags
        )
      )
    }
  }

  const properties = item.members.filter(m => m.kind === 'PropertySignature')
  if (properties.length > 0) {
    genModel.properties = []
    for (const property of properties) {
      genModel.properties.push(
        parseContentForClassinizable(
          style,
          model,
          pkg,
          resolver,
          property,
          'property',
          customTags
        )
      )
    }
  }

  // console.log('interface genmodel', genModel)
  return genModel
}

function parseClass() {}

function parseTypeAlias(style, model, pkg, resolver, item, customTags) {
  const genModel = {
    name: item.displayName,
    type: item.kind
  }

  const docs = item.tsdocComment
  if (!docs) {
    return genModel
  }

  // modifierTags
  genModel.modifierTags = docs.modifierTagSet.nodes
    ? docs.modifierTagSet.nodes.map(n => n.tagName)
    : []

  // sumarry
  if (docs.summarySection) {
    genModel.summary = getDocSectionContent(
      model,
      pkg,
      docs.summarySection,
      item,
      style,
      resolver,
      customTags
    )
  }

  // signature
  if (item.excerptTokens) {
    genModel.signature = item.excerptTokens.map(token => token.text).join('')
  }

  // remarks
  if (docs.remarksBlock) {
    genModel.remarks = getDocSectionContent(
      model,
      pkg,
      docs.remarksBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  }

  // examples
  const examples = findCustomTags(docs.customBlocks, '@example')
  if (examples.length > 0) {
    genModel.examples = []
    for (const e of examples) {
      genModel.examples.push(
        getDocSectionContent(
          model,
          pkg,
          e.content,
          item,
          style,
          resolver,
          customTags
        )
      )
    }
  }

  // console.log('typealias genmodel', genModel)
  return genModel
}

function parseVariable(style, model, pkg, resolver, item, customTags) {
  const genModel = {
    name: item.displayName,
    type: item.kind
  }

  const docs = item.tsdocComment
  if (!docs) {
    return genModel
  }

  // modifierTags
  genModel.modifierTags = docs.modifierTagSet.nodes
    ? docs.modifierTagSet.nodes.map(n => n.tagName)
    : []

  // sumarry
  if (docs.summarySection) {
    genModel.summary = getDocSectionContent(
      model,
      pkg,
      docs.summarySection,
      item,
      style,
      resolver,
      customTags
    )
  }

  // signature
  if (item.excerptTokens) {
    genModel.signature = item.excerptTokens.map(token => token.text).join('')
  }

  // remarks
  if (docs.remarksBlock) {
    genModel.remarks = getDocSectionContent(
      model,
      pkg,
      docs.remarksBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  }

  // examples
  const examples = findCustomTags(docs.customBlocks, '@example')
  if (examples.length > 0) {
    genModel.examples = []
    for (const e of examples) {
      genModel.examples.push(
        getDocSectionContent(
          model,
          pkg,
          e.content,
          item,
          style,
          resolver,
          customTags
        )
      )
    }
  }

  // console.log('variable genmodel', genModel)
  return genModel
}

module.exports = process
