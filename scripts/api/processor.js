const {
  getDocSectionContent,
  escapeTextForTable,
  findCustomTags,
  createContentBuilder
} = require('api-docs-gen')

function escapeTitle(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

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
          // TODO:
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
    const targets = [
      {
        tag: '@VueI18nGeneral',
        title: 'General',
        file: 'general.md'
      },
      {
        tag: '@VueI18nLegacy',
        title: 'Legacy API',
        file: 'legacy.md'
      },
      {
        tag: '@VueI18nComposition',
        title: 'Composition API',
        file: 'composition.md'
      },
      {
        tag: '@VueI18nComponent',
        title: 'Components',
        file: 'component.md'
      },
      {
        tag: '@VueI18nDirective',
        title: 'Directives',
        file: 'directive.md'
      }
      // {
      //   tag: '@VueI18nInjection',
      //   title: 'Component Injections',
      //   file: 'injection.md'
      // }
    ]

    return targets.map(t => {
      const targetModels = models.filter(
        m => m.modifierTags && m.modifierTags.includes(t.tag)
      )
      return buildContents(targetModels, t.title, t.file)
    })
  }

  function buildContents(models, title, filename) {
    const builder = createContentBuilder()
    builder.pushline(`# ${title}`)
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
      filename: filename,
      body: builder.content
    }
  }

  const models = parse()
  const contents = build(models)

  return contents
}

function buildFunction(model, builder) {
  model.summary && buildSummary(model, builder)
  model.signature && buildSignature(model, builder)
  model.typeParameters && buildTypeParameters(model, builder)
  model.deprecated && buildDeprecated(model, builder)
  model.remarks && buildDetails(model, builder)
  model.tips && buildTips(model, builder)
  model.dangers && buildDangers(model, builder)
  model.warnings && buildWarnings(model, builder)
  model.seeAlso && buildSeeAlso(model, builder)
  model.parameters && buildParameters(model, builder)
  model.returns && buildReturns(model, builder)
  model.throws && buildThrows(model, builder)
  model.examples && buildExamples(model, builder)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildEnum(model, builder) {
  // TODO:
}

function buildInterface(model, builder) {
  model.summary && buildSummary(model, builder)
  model.signature && buildSignature(model, builder)
  model.typeParameters && buildTypeParameters(model, builder)
  model.deprecated && buildDeprecated(model, builder)
  model.remarks && buildDetails(model, builder)
  model.tips && buildTips(model, builder)
  model.dangers && buildDangers(model, builder)
  model.warnings && buildWarnings(model, builder)
  model.seeAlso && buildSeeAlso(model, builder)
  model.examples && buildExamples(model, builder)

  if (model.properties) {
    for (const p of model.properties) {
      builder.pushline(`### ${p.name}`)
      builder.newline()
      buildPropertySignature(p, builder)
    }
  }

  if (model.functions) {
    for (const m of model.functions) {
      builder.pushline(`### ${m.name}`)
      builder.newline()
      buildMethodSignature(m, builder)
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
  model.summary && buildSummary(model, builder)
  model.signature && buildSignature(model, builder)
  model.typeParameters && buildTypeParameters(model, builder, 4)
  model.deprecated && buildDeprecated(model, builder)
  model.remarks && buildDetails(model, builder)
  model.tips && buildTips(model, builder)
  model.dangers && buildDangers(model, builder)
  model.warnings && buildWarnings(model, builder)
  model.defaultValue && buildDefaultValue(model, builder)
  model.seeAlso && buildSeeAlso(model, builder)
  model.examples && buildExamples(model, builder)
}

function buildMethodSignature(model, builder) {
  model.summary && buildSummary(model, builder)
  model.signature && buildSignature(model, builder)
  model.typeParameters && buildTypeParameters(model, builder, 4)
  model.deprecated && buildDeprecated(model, builder)
  model.remarks && buildDetails(model, builder)
  model.seeAlso && buildSeeAlso(model, builder)
  model.tips && buildTips(model, builder)
  model.dangers && buildDangers(model, builder)
  model.warnings && buildWarnings(model, builder)
  model.parameters && buildParameters(model, builder, 4)
  model.returns && buildReturns(model, builder, 4)
  model.throws && buildThrows(model, builder, 4)
  model.examples && buildExamples(model, builder)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildClass(model, builder) {
  // TODO:
}

function buildTypeAlias(model, builder) {
  model.summary && buildSummary(model, builder)
  model.signature && buildSignature(model, builder)
  model.typeParameters && buildTypeParameters(model, builder)
  model.deprecated && buildDeprecated(model, builder)
  model.remarks && buildDetails(model, builder)
  model.tips && buildTips(model, builder)
  model.dangers && buildDangers(model, builder)
  model.warnings && buildWarnings(model, builder)
  model.seeAlso && buildSeeAlso(model, builder)
  model.examples && buildExamples(model, builder)
}

function buildVariable(model, builder) {
  model.summary && buildSummary(model, builder)
  model.signature && buildSignature(model, builder)
  model.deprecated && buildDeprecated(model, builder)
  model.remarks && buildDetails(model, builder)
  model.tips && buildTips(model, builder)
  model.dangers && buildDangers(model, builder)
  model.warnings && buildWarnings(model, builder)
  model.seeAlso && buildSeeAlso(model, builder)
  model.examples && buildExamples(model, builder)
}

function buildSummary(model, builder) {
  builder.pushline(model.summary)
  builder.newline()
}

function buildSignature(model, builder) {
  builder.pushline(`**Signature:**`)
  builder.pushline('```typescript')
  builder.pushline(model.signature)
  builder.pushline('```')
  builder.newline()
}

function buildTypeParameters(model, builder, level = 3) {
  builder.pushline(`${'#'.repeat(level)} Type Parameters`)
  builder.newline()
  builder.pushline(`| Parameter | Description |`)
  builder.pushline(`| --- | --- |`)
  for (const p of model.typeParameters) {
    builder.pushline(`| ${p.name} | ${p.description} |`)
  }
  builder.newline()
}

function buildDeprecated(model, builder) {
  builder.pushline(`:::danger DEPRECATED`)
  builder.pushline(model.deprecated)
  builder.pushline(`:::`)
  builder.newline()
}

function buildTips(model, builder) {
  builder.pushline(`:::tip`)
  for (const tip of model.tips) {
    builder.pushline(tip)
  }
  builder.pushline(`:::`)
  builder.newline()
}

function buildDangers(model, builder) {
  builder.pushline(`:::danger`)
  for (const danger of model.dangers) {
    builder.pushline(danger)
  }
  builder.pushline(`:::`)
  builder.newline()
}

function buildWarnings(model, builder) {
  builder.pushline(`:::warning`)
  for (const warning of model.warnings) {
    builder.pushline(warning)
  }
  builder.pushline(`:::`)
  builder.newline()
}

function buildDetails(model, builder) {
  builder.pushline(`**Details**`)
  builder.newline()
  builder.pushline(model.remarks)
  builder.newline()
}

function buildDefaultValue(model, builder) {
  builder.pushline(`**Default Value**`)
  builder.newline()
  builder.pushline(model.defaultValue)
  builder.newline()
}

function buildSeeAlso(model, builder) {
  builder.pushline(`**See Also**`)
  for (const see of model.seeAlso) {
    builder.pushline(`- ${see}`)
  }
  builder.newline()
}

function buildParameters(model, builder, level = 3) {
  builder.pushline(`${'#'.repeat(level)} Parameters`)
  builder.newline()
  builder.pushline(`| Parameter | Type | Description |`)
  builder.pushline(`| --- | --- | --- |`)
  for (const p of model.parameters) {
    builder.pushline(
      `| ${p.name} | ${normalize(escapeTextForTable(p.type))} | ${
        p.description
      } |`
    )
  }
  builder.newline()
}

function buildReturns(model, builder, level = 3) {
  builder.pushline(`${'#'.repeat(level)} Returns`)
  builder.newline()
  builder.pushline(model.returns)
  builder.newline()
}

function buildThrows(model, builder, level = 3) {
  builder.pushline(`${'#'.repeat(level)} Throws`)
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

function buildExamples(model, builder) {
  if (model.examples.length > 0) {
    builder.pushline(`**Examples**`)
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

function normalize(text) {
  return text.replace(/\n/g, ' ')
}

function parseFunction(style, model, pkg, resolver, item, customTags) {
  const genModel = {
    name: item.displayName,
    // name: item.parameters
    //   ? `${item.displayName}(${item.parameters.map(p => p.name).join(', ')})`
    //   : item.displayName,
    type: item.kind
  }

  const docs = item.tsdocComment
  if (!docs) {
    return genModel
  }

  // modifierTags
  genModel.modifierTags = getModifierTags(docs)

  // summary
  genModel.summary = getSummary(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // signature
  genModel.signature = getSignature(item)

  // type parameters
  genModel.typeParameters = getTypeParameters(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // deprecated
  genModel.deprecated = getDeprecated(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // remarks
  genModel.remarks = getRamrks(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // see also
  genModel.seeAlso = getSeeAlso(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // tips
  genModel.tips = getTips(docs, style, model, pkg, resolver, item, customTags)

  // dangers
  genModel.dangers = getDangers(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // warnings
  genModel.warnings = getWarnings(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // parameters
  genModel.parameters = getParameters(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // returns
  genModel.returns = getReturns(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // throws
  genModel.throws = getThrows(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // examples
  genModel.examples = getExamples(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

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
  genModel.modifierTags = getModifierTags(docs)

  // summary
  genModel.summary = getSummary(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // signature
  genModel.signature = getSignature(item)

  // deprecated
  genModel.deprecated = getDeprecated(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // remarks
  genModel.remarks = getRamrks(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // see also
  genModel.seeAlso = getSeeAlso(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // tips
  genModel.tips = getTips(docs, style, model, pkg, resolver, item, customTags)

  // dangers
  genModel.dangers = getDangers(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // warnings
  genModel.warnings = getWarnings(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

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
  genModel.examples = getExamples(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // console.log('enum genmodel', genModel)
  return genModel
}

function getNameSignature(item, type) {
  if ((type === 'constrcutor' || type === 'method') && item.parameters) {
    return `${
      type === 'constrcutor' ? 'constructor' : item.displayName
    }(${item.parameters.map(p => p.name).join(', ')})`
  } else if (type === 'function') {
    const display = item.excerptTokens.map(token => token.text).join('')
    return escapeTitle(display.slice(display.indexOf('(')))
  } else {
    return item.displayName
  }
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
    name: getNameSignature(item, type),
    type: item.kind
  }

  const docs = item.tsdocComment
  if (!docs) {
    return genModel
  }

  // modifierTags
  genModel.modifierTags = getModifierTags(docs)

  // summary
  genModel.summary = getSummary(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // signature
  genModel.signature = getSignature(item)

  // type parameters
  genModel.typeParameters = getTypeParameters(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // deprecated
  genModel.deprecated = getDeprecated(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // remarks
  genModel.remarks = getRamrks(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // defaultValue
  if (type === 'property') {
    genModel.defaultValue = getDefaultValue(
      docs,
      style,
      model,
      pkg,
      resolver,
      item,
      customTags
    )
  }

  // see also
  genModel.seeAlso = getSeeAlso(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // tips
  genModel.tips = getTips(docs, style, model, pkg, resolver, item, customTags)

  // dangers
  genModel.dangers = getDangers(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // warnings
  genModel.warnings = getWarnings(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // parameters
  if (type === 'constrcutor' || type === 'method' || type === 'function') {
    genModel.parameters = getParameters(
      docs,
      style,
      model,
      pkg,
      resolver,
      item,
      customTags
    )
  }

  // returns
  if (type === 'method' || type === 'function') {
    genModel.returns = getReturns(
      docs,
      style,
      model,
      pkg,
      resolver,
      item,
      customTags
    )
  }

  // throws
  if (type === 'constructor' || type === 'method' || type === 'function') {
    genModel.throws = getThrows(
      docs,
      style,
      model,
      pkg,
      resolver,
      item,
      customTags
    )
  }

  // examples
  genModel.examples = getExamples(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

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

  const functions = item.members.filter(m => m.kind === 'CallSignature')
  if (functions.length > 0) {
    genModel.functions = []
    for (const func of functions) {
      genModel.functions.push(
        parseContentForClassinizable(
          style,
          model,
          pkg,
          resolver,
          func,
          'function',
          customTags
        )
      )
    }
  }

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseClass() {
  // TODO:
}

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
  genModel.modifierTags = getModifierTags(docs)

  // sumarry
  genModel.summary = getSummary(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // signature
  genModel.signature = getSignature(item)

  // type parameters
  genModel.typeParameters = getTypeParameters(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // deprecated
  genModel.deprecated = getDeprecated(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // remarks
  genModel.remarks = getRamrks(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // see also
  genModel.seeAlso = getSeeAlso(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // tips
  genModel.tips = getTips(docs, style, model, pkg, resolver, item, customTags)

  // dangers
  genModel.dangers = getDangers(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // warnings
  genModel.warnings = getWarnings(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // examples
  genModel.examples = getExamples(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

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
  genModel.modifierTags = getModifierTags(docs)

  // summary
  genModel.summary = getSummary(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // signature
  genModel.signature = getSignature(item)

  // deprecated
  genModel.deprecated = getDeprecated(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // remarks
  genModel.remarks = getRamrks(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // see also
  genModel.seeAlso = getSeeAlso(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // tips
  genModel.tips = getTips(docs, style, model, pkg, resolver, item, customTags)

  // dangers
  genModel.dangers = getDangers(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // warnings
  genModel.warnings = getWarnings(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // examples
  genModel.examples = getExamples(
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )

  // console.log('variable genmodel', genModel)
  return genModel
}

function getModifierTags(docs) {
  return docs.modifierTagSet.nodes
    ? docs.modifierTagSet.nodes.map(n => n.tagName)
    : []
}

function getSummary(docs, style, model, pkg, resolver, item, customTags) {
  if (docs.summarySection) {
    return getDocSectionContent(
      model,
      pkg,
      docs.summarySection,
      item,
      style,
      resolver,
      customTags
    )
  } else {
    return undefined
  }
}

function getSignature(item) {
  return item.excerptTokens
    ? item.excerptTokens.map(token => token.text).join('')
    : undefined
}

function getTypeParameters(
  docs,
  style,
  model,
  pkg,
  resolver,
  item,
  customTags
) {
  if (docs.typeParams && docs.typeParams.count > 0) {
    return docs.typeParams.blocks.map(b => {
      return {
        name: b.parameterName,
        description: b.content
          ? getDocSectionContent(
              model,
              pkg,
              b.content,
              item,
              style,
              resolver,
              customTags
            )
          : ''
      }
    })
  } else {
    return undefined
  }
}

function getDeprecated(docs, style, model, pkg, resolver, item, customTags) {
  if (docs.deprecatedBlock) {
    return getDocSectionContent(
      model,
      pkg,
      docs.deprecatedBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  } else {
    return undefined
  }
}

function getRamrks(docs, style, model, pkg, resolver, item, customTags) {
  if (docs.remarksBlock) {
    return getDocSectionContent(
      model,
      pkg,
      docs.remarksBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  } else {
    return undefined
  }
}

function getSeeAlso(docs, style, model, pkg, resolver, item, customTags) {
  return getCustomBlockContents(
    '@VueI18nSee',
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )
}

function getTips(docs, style, model, pkg, resolver, item, customTags) {
  return getCustomBlockContents(
    '@VueI18nTip',
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )
}

function getDangers(docs, style, model, pkg, resolver, item, customTags) {
  return getCustomBlockContents(
    '@VueI18nDanger',
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )
}

function getWarnings(docs, style, model, pkg, resolver, item, customTags) {
  return getCustomBlockContents(
    '@VueI18nWarning',
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )
}

function getParameters(docs, style, model, pkg, resolver, item, customTags) {
  if (item.parameters) {
    return item.parameters.map(p => {
      return {
        name: p.name,
        type: p.parameterTypeExcerpt.text.trim(),
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
      }
    })
  } else {
    return undefined
  }
}

function getReturns(docs, style, model, pkg, resolver, item, customTags) {
  if (docs.returnsBlock) {
    return getDocSectionContent(
      model,
      pkg,
      docs.returnsBlock.content,
      item,
      style,
      resolver,
      customTags
    )
  } else {
    return undefined
  }
}

function getThrows(docs, style, model, pkg, resolver, item, customTags) {
  return getCustomBlockContents(
    '@throws',
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )
}

function getExamples(docs, style, model, pkg, resolver, item, customTags) {
  return getCustomBlockContents(
    '@example',
    docs,
    style,
    model,
    pkg,
    resolver,
    item,
    customTags
  )
}

function getDefaultValue(docs, style, model, pkg, resolver, item, customTags) {
  const defaultValues = findCustomTags(docs.customBlocks, '@defaultValue')
  if (defaultValues && defaultValues.length > 0) {
    return getDocSectionContent(
      model,
      pkg,
      defaultValues[0].content,
      item,
      style,
      resolver,
      customTags
    )
  } else {
    return undefined
  }
}

function getCustomBlockContents(
  tag,
  docs,
  style,
  model,
  pkg,
  resolver,
  item,
  customTags
) {
  const blocks = findCustomTags(docs.customBlocks, tag)
  if (blocks.length > 0) {
    return blocks.map(b => {
      return getDocSectionContent(
        model,
        pkg,
        b.content,
        item,
        style,
        resolver,
        customTags
      )
    })
  } else {
    return undefined
  }
}

module.exports = process
