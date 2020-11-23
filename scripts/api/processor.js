const {
  getDocSectionContent,
  escapeText,
  findCustomTags,
  createContentBuilder
} = require('api-docs-gen')

function process(model, pkg, style, resolver, customTags) {
  // console.log('custom process', model, pkg, style, customTags)

  function parse() {
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
    return models
  }

  function build(models) {
    const generalModels = models.filter(
      m => m.modifierTags && m.modifierTags.includes('@VueI18nGeneral')
    )
    const legacyModels = models.filter(
      m => m.modifierTags && m.modifierTags.includes('@VueI18nLegacy')
    )
    const compositionModels = models.filter(
      m => m.modifierTags && m.modifierTags.includes('@VueI18nComposition')
    )
    const miscModels = models.filter(
      m => m.modifierTags && m.modifierTags.length === 0
    )
    console.log('misc models', miscModels)

    const contents = []
    contents.push(buildGeneral(generalModels))
    contents.push(buildLegacy(legacyModels))
    contents.push(buildComposition(compositionModels))
    // contents.push(buildMisc(miscModels))
    return contents
  }

  function buildFunction(model, builder) {
    if (model.summary) {
      builder.pushline(model.summary)
      builder.newline()
    }

    if (model.signature) {
      builder.pushline(`**Signature:**`)
      builder.pushline('```typescript')
      builder.pushline(model.signature)
      builder.pushline('```')
      builder.newline()
    }

    if (model.remarks) {
      builder.pushline(`### Remarks`)
      builder.newline()
      builder.pushline(model.remarks)
      builder.newline()
    }

    if (model.parameters) {
      builder.pushline(`### Parameters`)
      builder.newline()
      builder.pushline(`| Parameter | Type | Description |`)
      builder.pushline(`| --- | --- | --- |`)
      for (const p of model.parameters) {
        builder.pushline(`| ${p.name} | ${p.type} | ${p.description} |`)
      }
      builder.newline()
    }

    if (model.returns) {
      builder.pushline(`### Returns`)
      builder.newline()
      builder.pushline(model.returns)
      builder.newline()
    }

    if (model.throws) {
      builder.pushline(`### Throws`)
      builder.newline()
      for (const t of model.throws) {
        let text = t
        if (model.throws.length > 1) {
          text = `- ` + text
        }
        builder.pushline(text)
      }
      builder.newline()
    }

    if (model.examples) {
      if (model.examples.length > 0) {
        builder.pushline(`### Examples`)
        builder.newline()
        let count = 1
        for (const e of model.examples) {
          if (model.examples.length > 1) {
            builder.pushline(`**Example ${count}:**`)
            builder.newline()
          }
          builder.pushline(e)
          builder.newline()
          count++
        }
        builder.newline()
      }
    }
  }

  function buildEnum(model, builder) {}

  function buildInterface(model, builder) {
    if (model.summary) {
      builder.pushline(model.summary)
      builder.newline()
    }

    if (model.signature) {
      builder.pushline(`**Signature:**`)
      builder.pushline('```typescript')
      builder.pushline(model.signature)
      builder.pushline('```')
      builder.newline()
    }

    if (model.remarks) {
      builder.pushline(`### Remarks`)
      builder.newline()
      builder.pushline(model.remarks)
      builder.newline()
    }

    if (model.examples) {
      if (model.examples.length > 0) {
        builder.pushline(`### Examples`)
        builder.newline()
        let count = 1
        for (const e of model.examples) {
          if (model.examples.length > 1) {
            builder.pushline(`**Example ${count}:**`)
            builder.newline()
          }
          builder.pushline(e)
          builder.newline()
          count++
        }
        builder.newline()
      }
    }

    if (model.properties) {
      for (const p of model.properties) {
        builder.pushline(`### ${p.name}`)
        builder.newline()
        buildPropertySignature(p, builder)
      }
    }

    if (model.methods) {
      for (const m of model.methods) {
        builder.pushline(`### ${m.name}`)
        builder.newline()
        buildMethodSignature(m, builder)
      }
    }
  }

  function buildPropertySignature(model, builder) {
    if (model.summary) {
      builder.pushline(model.summary)
      builder.newline()
    }

    if (model.signature) {
      builder.pushline(`**Signature:**`)
      builder.pushline('```typescript')
      builder.pushline(model.signature)
      builder.pushline('```')
      builder.newline()
    }

    if (model.remarks) {
      builder.pushline(`#### Remarks`)
      builder.newline()
      builder.pushline(model.remarks)
      builder.newline()
    }

    if (model.examples) {
      if (model.examples.length > 0) {
        builder.pushline(`#### Examples`)
        builder.newline()
        let count = 1
        for (const e of model.examples) {
          if (model.examples.length > 1) {
            builder.pushline(`**Example ${count}:**`)
            builder.newline()
          }
          builder.pushline(e)
          builder.newline()
          count++
        }
        builder.newline()
      }
    }
  }

  function buildMethodSignature(model, builder) {
    if (model.summary) {
      builder.pushline(model.summary)
      builder.newline()
    }

    if (model.signature) {
      builder.pushline(`**Signature:**`)
      builder.pushline('```typescript')
      builder.pushline(model.signature)
      builder.pushline('```')
      builder.newline()
    }

    if (model.remarks) {
      builder.pushline(`#### Remarks`)
      builder.newline()
      builder.pushline(model.remarks)
      builder.newline()
    }

    if (model.parameters) {
      builder.pushline(`#### Parameters`)
      builder.newline()
      builder.pushline(`| Parameter | Type | Description |`)
      builder.pushline(`| --- | --- | --- |`)
      for (const p of model.parameters) {
        builder.pushline(`| ${p.name} | ${p.type} | ${p.description} |`)
      }
      builder.newline()
    }

    if (model.returns) {
      builder.pushline(`#### Returns`)
      builder.newline()
      builder.pushline(model.returns)
      builder.newline()
    }

    if (model.throws) {
      builder.pushline(`#### Throws`)
      builder.newline()
      for (const t of model.throws) {
        let text = t
        if (model.throws.length > 1) {
          text = `- ` + text
        }
        builder.pushline(text)
      }
      builder.newline()
    }

    if (model.examples) {
      if (model.examples.length > 0) {
        builder.pushline(`#### Examples`)
        builder.newline()
        let count = 1
        for (const e of model.examples) {
          if (model.examples.length > 1) {
            builder.pushline(`**Example ${count}:**`)
            builder.newline()
          }
          builder.pushline(e)
          builder.newline()
          count++
        }
        builder.newline()
      }
    }
  }

  function buildClass(model, builder) {}

  function buildTypeAlias(model, builder) {
    if (model.summary) {
      builder.pushline(model.summary)
      builder.newline()
    }

    if (model.signature) {
      builder.pushline(`**Signature:**`)
      builder.pushline('```typescript')
      builder.pushline(model.signature)
      builder.pushline('```')
      builder.newline()
    }

    if (model.remarks) {
      builder.pushline(`### Remarks`)
      builder.newline()
      builder.pushline(model.remarks)
      builder.newline()
    }

    if (model.examples) {
      if (model.examples.length > 0) {
        builder.pushline(`### Examples`)
        builder.newline()
        let count = 1
        for (const e of model.examples) {
          if (model.examples.length > 1) {
            builder.pushline(`**Example ${count}:**`)
            builder.newline()
          }
          builder.pushline(e)
          builder.newline()
          count++
        }
        builder.newline()
      }
    }
  }

  function buildVariable(model, builder) {}

  function buildGeneral(models) {
    const builder = createContentBuilder()
    builder.pushline(`# General`)
    builder.newline()

    models.sort((a, b) => a.name.localeCompare(b.name))
    models.forEach(m => {
      builder.pushline(`## ${m.name}`)
      builder.newline()
      switch (m.type) {
        case 'Function':
          buildFunction(m, builder)
          break
        case 'Enum':
          buildEnum(m, builder)
          break
        case 'Interface':
          buildInterface(m, builder)
          break
        case 'Class':
          buildClass(m, builder)
          break
        case 'TypeAlias':
          buildTypeAlias(m, builder)
          break
        case 'Variable':
          buildVariable(m, builder)
          break
        default:
          break
      }
    })

    return {
      filename: 'general.md',
      body: builder.content
    }
  }

  function buildLegacy(models) {
    const builder = createContentBuilder()
    builder.pushline(`# Legacy API`)
    builder.newline()

    models.sort((a, b) => a.name.localeCompare(b.name))
    models.forEach(m => {
      builder.pushline(`## ${m.name}`)
      builder.newline()
      switch (m.type) {
        case 'Function':
          buildFunction(m, builder)
          break
        case 'Enum':
          buildEnum(m, builder)
          break
        case 'Interface':
          buildInterface(m, builder)
          break
        case 'Class':
          buildClass(m, builder)
          break
        case 'TypeAlias':
          buildTypeAlias(m, builder)
          break
        case 'Variable':
          buildVariable(m, builder)
          break
        default:
          break
      }
    })

    return {
      filename: 'legacy.md',
      body: builder.content
    }
  }

  function buildComposition(models) {
    const builder = createContentBuilder()
    builder.pushline(`# Composition API`)
    builder.newline()

    models.sort((a, b) => a.name.localeCompare(b.name))
    models.forEach(m => {
      builder.pushline(`## ${m.name}`)
      builder.newline()
      switch (m.type) {
        case 'Function':
          buildFunction(m, builder)
          break
        case 'Enum':
          buildEnum(m, builder)
          break
        case 'Interface':
          buildInterface(m, builder)
          break
        case 'Class':
          buildClass(m, builder)
          break
        case 'TypeAlias':
          buildTypeAlias(m, builder)
          break
        case 'Variable':
          buildVariable(m, builder)
          break
        default:
          break
      }
    })

    return {
      filename: 'composition.md',
      body: builder.content
    }
  }

  /*
  function buildMisc(models) {
    const builder = createContentBuilder()
    builder.pushline(`# Misc`)
    builder.newline()

    models.sort((a, b) => a.name.localeCompare(b.name))
    models.forEach(m => {
      builder.pushline(`## ${m.name}`)
      builder.newline()
    })

    return {
      filename: 'misc.md',
      body: builder.content
    }
  }
  */

  const models = parse()
  const contents = build(models)

  return contents
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
