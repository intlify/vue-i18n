/*!
 * vue-i18n v9.0.0-alpah.0 
 * (c) 2020 kazuya kawaguchi
 * Released under the MIT License.
 */
var VueI18n = (function (exports, vue) {
  'use strict';

  const isArray = Array.isArray;
  const isNumber = (val) => ((typeof val === 'number') && (isFinite(val)));
  const isFunction = (val) => typeof val === 'function';
  const isString = (val) => typeof val === 'string';
  const isSymbol = (val) => typeof val === 'symbol';
  const isObject = (val) => // eslint-disable-line
   val !== null && typeof val === 'object';
  const isPromise = (val) => {
      return isObject(val) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const isPlainObject = (val) => toTypeString(val) === '[object Object]';
  // for converting list and named values to displayed strings.
  const toDisplayString = (val) => {
      return val == null
          ? ''
          : isArray(val) || (isPlainObject(val) && val.toString === objectToString)
              ? JSON.stringify(val, null, 2)
              : String(val);
  };

  const CHAR_SP = ' ';
  const CHAR_CR = '\r';
  const CHAR_LF = '\n';
  const CHAR_LS = String.fromCharCode(0x2028);
  const CHAR_PS = String.fromCharCode(0x2029);
  function createScanner(str) {
      const _buf = str;
      let _index = 0;
      let _line = 1;
      let _column = 1;
      let _peekOffset = 0;
      const isCRLF = (index) => _buf[index] === CHAR_CR && _buf[index + 1] === CHAR_LF;
      const isLF = (index) => _buf[index] === CHAR_LF;
      const isPS = (index) => _buf[index] === CHAR_PS;
      const isLS = (index) => _buf[index] === CHAR_LS;
      const isLineEnd = (index) => isCRLF(index) || isLF(index) || isPS(index) || isLS(index);
      const index = () => _index;
      const line = () => _line;
      const column = () => _column;
      const peekOffset = () => _peekOffset;
      function charAt(offset) {
          if (isCRLF(offset) || isPS(offset) || isLS(offset)) {
              return CHAR_LF;
          }
          return _buf[offset];
      }
      const currentChar = () => charAt(_index);
      const currentPeek = () => charAt(_index + _peekOffset);
      function next() {
          _peekOffset = 0;
          if (isLineEnd(_index)) {
              _line++;
              _column = 0;
          }
          if (isCRLF(_index)) {
              _index++;
          }
          _index++;
          _column++;
          return _buf[_index];
      }
      function peek() {
          if (isCRLF(_index + _peekOffset)) {
              _peekOffset++;
          }
          _peekOffset++;
          return _buf[_index + _peekOffset];
      }
      function reset() {
          _index = 0;
          _line = 1;
          _column = 1;
          _peekOffset = 0;
      }
      function resetPeek(offset = 0) {
          _peekOffset = offset;
      }
      function skipToPeek() {
          const target = _index + _peekOffset;
          while (target !== _index) {
              next();
          }
          _peekOffset = 0;
      }
      return Object.freeze({
          index, line, column, peekOffset, charAt, currentChar, currentPeek,
          next, peek, reset, resetPeek, skipToPeek
      });
  }

  function createPosition(line, column, offset) {
      return { line, column, offset };
  }
  function createLocation(start, end, source) {
      return { start, end, source };
  }

  // TODO: should be move to utils
  const EOF = undefined;
  function createTokenizer(source) {
      const _scnr = createScanner(source);
      const currentOffset = () => _scnr.index();
      const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
      const _initLoc = currentPosition();
      const _initOffset = currentOffset();
      const _context = {
          currentType: 14 /* EOF */,
          currentValue: null,
          offset: _initOffset,
          startLoc: _initLoc,
          endLoc: _initLoc,
          lastType: 14 /* EOF */,
          lastOffset: _initOffset,
          lastStartLoc: _initLoc,
          lastEndLoc: _initLoc
      };
      const context = () => _context;
      const getToken = (context, type, value) => {
          context.endLoc = currentPosition();
          context.currentType = type;
          context.currentValue = value;
          return { type, value, loc: createLocation(context.startLoc, context.endLoc) };
      };
      const peekSpaces = (scnr) => {
          while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
              scnr.peek();
          }
      };
      const skipSpaces = (scnr) => {
          peekSpaces(scnr);
          scnr.skipToPeek();
      };
      const isIdentifierStart = (ch) => {
          if (!ch) {
              return false;
          }
          const cc = ch.charCodeAt(0);
          return (cc >= 97 && cc <= 122) || // a-z
              (cc >= 65 && cc <= 90); // A-Z
      };
      const isNumberStart = (ch) => {
          if (!ch) {
              return false;
          }
          const cc = ch.charCodeAt(0);
          return cc >= 48 && cc <= 57; // 0-9
      };
      const isNamedIdentifier = (scnr, context) => {
          const { currentType } = context;
          if (currentType !== 2 /* BraceLeft */) {
              return false;
          }
          peekSpaces(scnr);
          const ret = isIdentifierStart(scnr.currentPeek());
          scnr.resetPeek();
          return ret;
      };
      const isListIdentifier = (scnr, context) => {
          const { currentType } = context;
          if (currentType !== 2 /* BraceLeft */) {
              return false;
          }
          peekSpaces(scnr);
          const ch = scnr.currentPeek() === '-'
              ? scnr.peek()
              : scnr.currentPeek();
          const ret = isNumberStart(ch);
          scnr.resetPeek();
          return ret;
      };
      const isLinkedModifier = (scnr, context) => {
          const { currentType } = context;
          if (currentType !== 8 /* LinkedDot */) {
              return false;
          }
          const ret = isIdentifierStart(scnr.currentPeek());
          scnr.resetPeek();
          return ret;
      };
      const isLinkedIdentifier = (scnr, context) => {
          const { currentType } = context;
          if (!(currentType === 9 /* LinkedDelimiter */ ||
              currentType === 12 /* ParenLeft */)) {
              return false;
          }
          const fn = () => {
              const ch = scnr.currentPeek();
              if (ch === "{" /* BraceLeft */) {
                  return isIdentifierStart(scnr.peek());
              }
              else if ((ch === "@" /* LinkedAlias */ ||
                  ch === "%" /* Modulo */ ||
                  ch === "|" /* Pipe */ ||
                  ch === ":" /* LinkedDelimiter */ ||
                  ch === "." /* LinkedDot */ ||
                  ch === CHAR_SP || !ch)) {
                  return false;
              }
              else if (ch === CHAR_LF) {
                  return fn();
              }
              else { // other charactors
                  return isIdentifierStart(ch);
              }
          };
          const ret = fn();
          scnr.resetPeek();
          return ret;
      };
      const isPluralStart = (scnr) => {
          peekSpaces(scnr);
          const ret = scnr.currentPeek() === "|" /* Pipe */;
          scnr.resetPeek();
          return ret;
      };
      const isTextStart = (scnr, context) => {
          const { currentType } = context;
          if (currentType === 2 /* BraceLeft */ ||
              currentType === 12 /* ParenLeft */ ||
              currentType === 8 /* LinkedDot */ ||
              currentType === 9 /* LinkedDelimiter */) {
              return false;
          }
          const fn = (hasSpace = false) => {
              const ch = scnr.currentPeek();
              if ((ch === "{" /* BraceLeft */ ||
                  ch === "%" /* Modulo */ ||
                  ch === "@" /* LinkedAlias */ || !ch)) {
                  return hasSpace;
              }
              else if (ch === "|" /* Pipe */) {
                  return false;
              }
              else if (ch === CHAR_SP) {
                  scnr.peek();
                  return fn(true);
              }
              else if (ch === CHAR_LF) {
                  scnr.peek();
                  return fn(true);
              }
              else {
                  return true;
              }
          };
          const ret = fn();
          scnr.resetPeek();
          return ret;
      };
      const takeChar = (scnr, fn) => {
          const ch = scnr.currentChar();
          if (ch === EOF) {
              return EOF;
          }
          if (fn(ch)) {
              scnr.next();
              return ch;
          }
          return null;
      };
      const takeIdentifierChar = (scnr) => {
          const closure = (ch) => {
              const cc = ch.charCodeAt(0);
              return ((cc >= 97 && cc <= 122) || // a-z
                  (cc >= 65 && cc <= 90) || // A-Z
                  (cc >= 48 && cc <= 57) || // 0-9
                  cc === 95 || cc === 36); // _ $
          };
          return takeChar(scnr, closure);
      };
      const takeDigit = (scnr) => {
          const closure = (ch) => {
              const cc = ch.charCodeAt(0);
              return (cc >= 48 && cc <= 57); // 0-9
          };
          return takeChar(scnr, closure);
      };
      const getDigits = (scnr) => {
          let ch = '';
          let num = '';
          while ((ch = takeDigit(scnr))) {
              num += ch;
          }
          if (num.length === 0) ;
          return num;
      };
      const readText = (scnr) => {
          const fn = (buf) => {
              const ch = scnr.currentChar();
              if ((ch === "{" /* BraceLeft */ ||
                  ch === "%" /* Modulo */ ||
                  ch === "@" /* LinkedAlias */ || !ch)) {
                  return buf;
              }
              else if (ch === CHAR_SP || ch === CHAR_LF) {
                  if (isPluralStart(scnr)) {
                      return buf;
                  }
                  else {
                      buf += ch;
                      scnr.next();
                      return fn(buf);
                  }
              }
              else {
                  buf += ch;
                  scnr.next();
                  return fn(buf);
              }
          };
          return fn('');
      };
      const readNamedIdentifier = (scnr) => {
          skipSpaces(scnr);
          let ch = '';
          let name = '';
          while ((ch = takeIdentifierChar(scnr))) {
              name += ch;
          }
          skipSpaces(scnr);
          return name;
      };
      const readListIdentifier = (scnr) => {
          skipSpaces(scnr);
          let value = '';
          if (scnr.currentChar() === '-') {
              scnr.next();
              value += `-${getDigits(scnr)}`;
          }
          else {
              value += getDigits(scnr);
          }
          skipSpaces(scnr);
          return parseInt(value, 10);
      };
      const readLinkedModifierArg = (scnr) => {
          let ch = '';
          let name = '';
          while ((ch = takeIdentifierChar(scnr))) {
              name += ch;
          }
          return name;
      };
      const readLinkedIdentifier = (scnr, context) => {
          const fn = (detect = false, useParentLeft = false, buf) => {
              const ch = scnr.currentChar();
              if ((ch === "{" /* BraceLeft */ ||
                  ch === "%" /* Modulo */ ||
                  ch === "@" /* LinkedAlias */ ||
                  ch === ")" /* ParenRight */ ||
                  ch === "|" /* Pipe */ || !ch)) {
                  return buf;
              }
              else if (ch === CHAR_SP) {
                  if (useParentLeft) {
                      buf += ch;
                      scnr.next();
                      return fn(detect, useParentLeft, buf);
                  }
                  else {
                      return buf;
                  }
              }
              else if (ch === CHAR_LF) {
                  buf += ch;
                  scnr.next();
                  return fn(detect, useParentLeft, buf);
              }
              else {
                  buf += ch;
                  scnr.next();
                  return fn(true, useParentLeft, buf);
              }
          };
          return fn(false, context.currentType === 12 /* ParenLeft */, '');
      };
      const readPlural = (scnr) => {
          skipSpaces(scnr);
          const plural = scnr.currentChar();
          scnr.next();
          skipSpaces(scnr);
          return plural;
      };
      const readToken = (scnr, context) => {
          let token = { type: 14 /* EOF */ };
          const ch = scnr.currentChar();
          switch (ch) {
              case "{" /* BraceLeft */:
                  scnr.next();
                  token = getToken(context, 2 /* BraceLeft */, "{" /* BraceLeft */);
                  break;
              case "}" /* BraceRight */:
                  scnr.next();
                  token = getToken(context, 3 /* BraceRight */, "}" /* BraceRight */);
                  break;
              case "@" /* LinkedAlias */:
                  scnr.next();
                  token = getToken(context, 7 /* LinkedAlias */, "@" /* LinkedAlias */);
                  break;
              case "." /* LinkedDot */:
                  scnr.next();
                  token = getToken(context, 8 /* LinkedDot */, "." /* LinkedDot */);
                  break;
              case ":" /* LinkedDelimiter */:
                  scnr.next();
                  token = getToken(context, 9 /* LinkedDelimiter */, ":" /* LinkedDelimiter */);
                  break;
              case "(" /* ParenLeft */:
                  scnr.next();
                  token = getToken(context, 12 /* ParenLeft */, "(" /* ParenLeft */);
                  break;
              case ")" /* ParenRight */:
                  scnr.next();
                  token = getToken(context, 13 /* ParenRight */, ")" /* ParenRight */);
                  break;
              case "%" /* Modulo */:
                  scnr.next();
                  token = getToken(context, 4 /* Modulo */, "%" /* Modulo */);
                  break;
              default:
                  if (isPluralStart(scnr)) {
                      token = getToken(context, 1 /* Pipe */, readPlural(scnr));
                  }
                  else if (isTextStart(scnr, context)) {
                      token = getToken(context, 0 /* Text */, readText(scnr));
                  }
                  else if (isNamedIdentifier(scnr, context)) {
                      token = getToken(context, 5 /* Named */, readNamedIdentifier(scnr));
                  }
                  else if (isListIdentifier(scnr, context)) {
                      token = getToken(context, 6 /* List */, readListIdentifier(scnr));
                  }
                  else if (isLinkedModifier(scnr, context)) {
                      token = getToken(context, 11 /* LinkedModifier */, readLinkedModifierArg(scnr));
                  }
                  else if (isLinkedIdentifier(scnr, context)) {
                      if (ch === "{" /* BraceLeft */) {
                          scnr.next();
                          token = getToken(context, 2 /* BraceLeft */, "{" /* BraceLeft */);
                      }
                      else {
                          token = getToken(context, 10 /* LinkedKey */, readLinkedIdentifier(scnr, context));
                      }
                  }
                  break;
          }
          return token;
      };
      const nextToken = () => {
          const { currentType, offset, startLoc, endLoc } = _context;
          _context.lastType = currentType;
          _context.lastOffset = offset;
          _context.lastStartLoc = startLoc;
          _context.lastEndLoc = endLoc;
          _context.offset = currentOffset();
          _context.startLoc = currentPosition();
          if (!_scnr.currentChar()) {
              return getToken(_context, 14 /* EOF */);
          }
          return readToken(_scnr, _context);
      };
      return Object.freeze({
          nextToken, currentOffset, currentPosition, context
      });
  }
  function parse(source) {
      const tokens = [];
      const tokenizer = createTokenizer(source);
      let token = null;
      do {
          token = tokenizer.nextToken();
          tokens.push(token);
      } while (token.type !== 14 /* EOF */);
      return tokens;
  }

  function createParser() {
      const startNode = (type, offset, loc) => {
          return {
              type,
              start: offset,
              end: offset,
              loc: { start: loc, end: loc }
          };
      };
      const endNode = (node, offset, loc, type) => {
          node.end = offset;
          if (type) {
              node.type = type;
          }
          if (node.loc) {
              node.loc.end = loc;
          }
      };
      const parseText = (tokenizer, value) => {
          const context = tokenizer.context();
          const node = startNode(3 /* Text */, context.offset, context.startLoc);
          node.value = value;
          endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
          return node;
      };
      const parseList = (tokenizer, index) => {
          const context = tokenizer.context();
          const { lastOffset: offset, lastStartLoc: loc } = context; // get brace left loc
          const node = startNode(5 /* List */, offset, loc);
          node.index = index;
          tokenizer.nextToken(); // skip brach right
          endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
          return node;
      };
      const parseNamed = (tokenizer, key) => {
          const context = tokenizer.context();
          const { lastOffset: offset, lastStartLoc: loc } = context; // get brace left loc
          const node = startNode(4 /* Named */, offset, loc);
          node.key = key;
          tokenizer.nextToken(); // skip brach right
          endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
          return node;
      };
      const parseLinkedModifier = (tokenizer) => {
          const token = tokenizer.nextToken();
          // check token
          if (!token.value || typeof token.value === 'number') {
              // TODO: should be thrown syntax error
              throw new Error();
          }
          const context = tokenizer.context();
          const { lastOffset: offset, lastStartLoc: loc } = context; // get linked dot loc
          const node = startNode(8 /* LinkedModifier */, offset, loc);
          node.value = token.value;
          endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
          return node;
      };
      const parseLinkedKey = (tokenizer, value) => {
          const context = tokenizer.context();
          const node = startNode(7 /* LinkedKey */, context.offset, context.startLoc);
          node.value = value;
          endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
          return node;
      };
      const parseLinked = (tokenizer) => {
          const context = tokenizer.context();
          const linkedNode = startNode(6 /* Linked */, context.offset, context.startLoc);
          let token = tokenizer.nextToken();
          if (token.type === 8 /* LinkedDot */) {
              linkedNode.modifier = parseLinkedModifier(tokenizer);
              token = tokenizer.nextToken();
          }
          // asset check token
          if (token.type !== 9 /* LinkedDelimiter */) {
              // TODO: should be thrown syntax error
              throw new Error();
          }
          token = tokenizer.nextToken();
          // skip paren left
          let hasParen = false;
          if (token.type === 12 /* ParenLeft */) {
              token = tokenizer.nextToken();
              hasParen = true;
          }
          // skip brace left
          if (token.type === 2 /* BraceLeft */) {
              token = tokenizer.nextToken();
          }
          switch (token.type) {
              case 10 /* LinkedKey */:
                  if (!token.value || typeof token.value !== 'string') {
                      // TODO: should be thrown syntax error
                      throw new Error();
                  }
                  linkedNode.key = parseLinkedKey(tokenizer, token.value);
                  break;
              case 5 /* Named */:
                  if (!token.value || typeof token.value === 'number') {
                      // TODO: should be thrown syntax error
                      throw new Error();
                  }
                  linkedNode.key = parseNamed(tokenizer, token.value);
                  break;
              case 6 /* List */:
                  if (token.value === undefined || typeof token.value === 'string') {
                      // TODO: should be thrown syntax error
                      throw new Error();
                  }
                  linkedNode.key = parseList(tokenizer, token.value);
                  break;
              default:
                  // TODO: should be thrown syntax error
                  throw new Error();
          }
          // skip paren right
          if (hasParen) {
              token = tokenizer.nextToken();
          }
          endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
          return linkedNode;
      };
      const parseMessage = (tokenizer) => {
          const context = tokenizer.context();
          const startOffset = context.currentType === 1 /* Pipe */
              ? tokenizer.currentOffset()
              : context.offset;
          const startLoc = context.currentType === 1 /* Pipe */
              ? context.endLoc
              : context.startLoc;
          const node = startNode(2 /* Message */, startOffset, startLoc);
          node.items = [];
          do {
              const token = tokenizer.nextToken();
              switch (token.type) {
                  case 0 /* Text */:
                      if (!token.value || typeof token.value === 'number') {
                          // TODO: should be thrown syntax error
                          throw new Error();
                      }
                      node.items.push(parseText(tokenizer, token.value));
                      break;
                  case 6 /* List */:
                      if (token.value === undefined || typeof token.value === 'string') {
                          // TODO: should be thrown syntax error
                          throw new Error();
                      }
                      node.items.push(parseList(tokenizer, token.value));
                      break;
                  case 5 /* Named */:
                      if (!token.value || typeof token.value === 'number') {
                          // TODO: should be thrown syntax error
                          throw new Error();
                      }
                      node.items.push(parseNamed(tokenizer, token.value));
                      break;
                  case 7 /* LinkedAlias */:
                      node.items.push(parseLinked(tokenizer));
                      break;
              }
          } while (context.currentType !== 14 /* EOF */ && context.currentType !== 1 /* Pipe */);
          // adjust message node loc
          const endOffset = context.currentType === 1 /* Pipe */
              ? context.lastOffset
              : tokenizer.currentOffset();
          const endLoc = context.currentType === 1 /* Pipe */
              ? context.lastEndLoc
              : tokenizer.currentPosition();
          endNode(node, endOffset, endLoc);
          return node;
      };
      const parsePlural = (tokenizer, offset, loc, msgNode) => {
          const context = tokenizer.context();
          const node = startNode(1 /* Plural */, offset, loc);
          node.cases = [];
          node.cases.push(msgNode);
          do {
              const msg = parseMessage(tokenizer);
              node.cases.push(msg);
          } while (context.currentType !== 14 /* EOF */);
          endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
          return node;
      };
      const parseResource = (tokenizer) => {
          const context = tokenizer.context();
          const { offset, startLoc } = context;
          const msgNode = parseMessage(tokenizer);
          if (context.currentType === 14 /* EOF */) {
              return msgNode;
          }
          else {
              return parsePlural(tokenizer, offset, startLoc, msgNode);
          }
      };
      function parse(source) {
          const tokenizer = createTokenizer(source);
          const context = tokenizer.context();
          const node = startNode(0 /* Resource */, context.offset, context.startLoc);
          node.body = parseResource(tokenizer);
          // assert wheather achieved to EOF
          if (context.currentType !== 14 /* EOF */) {
              // TODO: should be thrown syntax error
              throw new Error();
          }
          endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
          return node;
      }
      return Object.freeze({
          parse
      });
  }

  function createTransformer(ast /*, options: TransformOptions */) {
      const _context = {
          ast,
          needInterpolate: false
      };
      const context = () => _context;
      return Object.freeze({
          context
      });
  }
  function traverseNodes(nodes, transformer) {
      for (let i = 0; i < nodes.length; i++) {
          traverseNode(nodes[i], transformer);
      }
  }
  function traverseNode(node, transformer) {
      const context = transformer.context();
      // TODO: if we need pre-hook of transform, should be implemeted to here
      switch (node.type) {
          case 1 /* Plural */:
              traverseNodes(node.cases, transformer);
              break;
          case 2 /* Message */:
              traverseNodes(node.items, transformer);
              break;
          case 6 /* Linked */:
              const linked = node;
              linked.modifier && traverseNode(linked.modifier, transformer);
              traverseNode(linked.key, transformer);
              break;
          case 5 /* List */:
          case 4 /* Named */:
              context.needInterpolate = true;
              break;
      }
      // TODO: if we need post-hook of transform, should be implemeted to here
  }
  // transform AST
  function transform(ast /*, options: TransformOptions */) {
      const transformer = createTransformer(ast);
      // traverse
      ast.body && traverseNode(ast.body, transformer);
      // set meta information
      const context = transformer.context();
      ast.needInterpolate = context.needInterpolate;
  }

  function createCodeGenerator(source) {
      const _context = {
          source,
          code: '',
          indentLevel: 0
      };
      const context = () => _context;
      const push = (code) => {
          _context.code += code;
      };
      const _newline = (n) => {
          push('\n' + `  `.repeat(n));
      };
      const indent = () => {
          _newline(++_context.indentLevel);
      };
      const deindent = (withoutNewLine) => {
          if (withoutNewLine) {
              --_context.indentLevel;
          }
          else {
              _newline(--_context.indentLevel);
          }
      };
      const newline = () => {
          _newline(_context.indentLevel);
      };
      return Object.freeze({
          context, push, indent, deindent, newline
      });
  }
  function generateLinkedNode(generator, node) {
      if (node.modifier) {
          generator.push('ctx.modifier(');
          generateNode(generator, node.modifier);
          generator.push(')(');
      }
      generator.push('ctx.message(');
      generateNode(generator, node.key);
      generator.push(')(ctx)');
      if (node.modifier) {
          generator.push(')');
      }
  }
  function generateMessageNode(generator, node) {
      if (node.items.length > 1) {
          generator.push('[');
          generator.indent();
          for (let i = 0; i < node.items.length; i++) {
              generateNode(generator, node.items[i]);
              if (i === node.items.length - 1) {
                  break;
              }
              generator.push(', ');
          }
          generator.deindent();
          generator.push('].join("")');
      }
      else {
          generateNode(generator, node.items[0]);
      }
  }
  function generatePluralNode(generator, node) {
      if (node.cases.length > 1) {
          generator.push('[');
          generator.indent();
          for (let i = 0; i < node.cases.length; i++) {
              generateNode(generator, node.cases[i]);
              generator.push(', ');
          }
          generator.push('""');
          generator.deindent();
          generator.push(`][ctx.pluralRule(ctx.pluralIndex, ${node.cases.length})]`);
      }
  }
  function generateResource(generator, node) {
      if (node.body) {
          generateNode(generator, node.body);
      }
      else {
          generator.push('null');
      }
  }
  function generateNode(generator, node) {
      switch (node.type) {
          case 0 /* Resource */:
              generateResource(generator, node);
              break;
          case 1 /* Plural */:
              generatePluralNode(generator, node);
              break;
          case 2 /* Message */:
              generateMessageNode(generator, node);
              break;
          case 6 /* Linked */:
              generateLinkedNode(generator, node);
              break;
          case 8 /* LinkedModifier */:
              generator.push(JSON.stringify(node.value));
              break;
          case 7 /* LinkedKey */:
              generator.push(JSON.stringify(node.value));
              break;
          case 5 /* List */:
              generator.push(`ctx.interpolate(ctx.list(${node.index}))`);
              break;
          case 4 /* Named */:
              generator.push(`ctx.interpolate(ctx.named(${JSON.stringify(node.key)}))`);
              break;
          case 3 /* Text */:
              generator.push(JSON.stringify(node.value));
              break;
          default:
              // TODO: should be handled with error
              throw new Error(`unhandled codegen node type: ${node.type}`);
      }
  }
  // generate code from AST
  const generate = (ast) => {
      const generator = createCodeGenerator(ast.loc && ast.loc.source);
      generator.push(`function __msg__ (ctx) {`);
      generator.indent();
      generator.push(`return `);
      generateNode(generator, ast);
      generator.deindent();
      generator.push(`}`);
      return generator.context().code;
  };

  function createCompiler() {
      const _parser = createParser();
      const compile = (source, options = {}) => {
          const ast = _parser.parse(source);
          transform(ast);
          const code = generate(ast);
          return { code, ast };
      };
      return Object.freeze({
          compile
      });
  }
  const compileCache = Object.create(null);
  const compiler = createCompiler();
  function compile(source, options = {}) {
      const { code } = compiler.compile(source, options);
      const msg = new Function(`return ${code}`)();
      return (compileCache[source] = msg);
  }

  const DEFAULT_MODIFIER = (str) => str;
  const DEFAULT_MESSAGE = (ctx) => ''; // eslint-disable-line
  function pluralDefault(choice, choicesLength) {
      choice = Math.abs(choice);
      if (choicesLength === 2) {
          return choice
              ? choice > 1
                  ? 1
                  : 0
              : 1;
      }
      return choice ? Math.min(choice, 2) : 0;
  }
  function getPluralIndex(options) {
      const index = isNumber(options.pluralIndex)
          ? options.pluralIndex
          : -1;
      return options.named && (isNumber(options.named.count) || isNumber(options.named.n))
          ? isNumber(options.named.count)
              ? options.named.count
              : isNumber(options.named.n)
                  ? options.named.n
                  : index
          : index;
  }
  function normalizeNamed(pluralIndex, named) {
      if (!named.count) {
          named.count = pluralIndex;
      }
      if (!named.n) {
          named.n = pluralIndex;
      }
  }
  function createMessageContext(options = {}) {
      // TODO: should be implemented warning message
      const pluralIndex = getPluralIndex(options);
      // TODO: should be implemented warning message
      const pluralRule = options.pluralRule || pluralDefault;
      const _list = options.list || [];
      // TODO: should be implemented warning message
      const list = (index) => _list[index];
      const _named = options.named || {};
      isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
      // TODO: should be implemented warning message
      const named = (key) => _named[key];
      // TODO: should be implemented warning message
      const modifier = (name) => options.modifiers
          ? options.modifiers[name]
          : DEFAULT_MODIFIER;
      const message = (name) => {
          // TODO: need to design resolve message function?
          const msg = isFunction(options.messages)
              ? options.messages(name)
              : isObject(options.messages)
                  ? options.messages[name]
                  : false;
          return !msg
              ? options.parent
                  ? options.parent.message(name) // resolve from parent messages
                  : DEFAULT_MESSAGE
              : msg;
      };
      return {
          list,
          named,
          pluralIndex,
          pluralRule,
          modifier,
          message,
          interpolate: toDisplayString
      };
  }

  const pathStateMachine = [];
  pathStateMachine[0 /* BEFORE_PATH */] = {
      ["w" /* WORKSPACE */]: [0 /* BEFORE_PATH */],
      ["i" /* IDENT */]: [3 /* IN_IDENT */, 0 /* APPEND */],
      ["[" /* LEFT_BRACKET */]: [4 /* IN_SUB_PATH */],
      ["o" /* END_OF_FAIL */]: [7 /* AFTER_PATH */]
  };
  pathStateMachine[1 /* IN_PATH */] = {
      ["w" /* WORKSPACE */]: [1 /* IN_PATH */],
      ["." /* DOT */]: [2 /* BEFORE_IDENT */],
      ["[" /* LEFT_BRACKET */]: [4 /* IN_SUB_PATH */],
      ["o" /* END_OF_FAIL */]: [7 /* AFTER_PATH */]
  };
  pathStateMachine[2 /* BEFORE_IDENT */] = {
      ["w" /* WORKSPACE */]: [2 /* BEFORE_IDENT */],
      ["i" /* IDENT */]: [3 /* IN_IDENT */, 0 /* APPEND */],
      ["0" /* ZERO */]: [3 /* IN_IDENT */, 0 /* APPEND */]
  };
  pathStateMachine[3 /* IN_IDENT */] = {
      ["i" /* IDENT */]: [3 /* IN_IDENT */, 0 /* APPEND */],
      ["0" /* ZERO */]: [3 /* IN_IDENT */, 0 /* APPEND */],
      ["w" /* WORKSPACE */]: [1 /* IN_PATH */, 1 /* PUSH */],
      ["." /* DOT */]: [2 /* BEFORE_IDENT */, 1 /* PUSH */],
      ["[" /* LEFT_BRACKET */]: [4 /* IN_SUB_PATH */, 1 /* PUSH */],
      ["o" /* END_OF_FAIL */]: [7 /* AFTER_PATH */, 1 /* PUSH */]
  };
  pathStateMachine[4 /* IN_SUB_PATH */] = {
      ["'" /* SINGLE_QUOTE */]: [5 /* IN_SINGLE_QUOTE */, 0 /* APPEND */],
      ["\"" /* DOUBLE_QUOTE */]: [6 /* IN_DOUBLE_QUOTE */, 0 /* APPEND */],
      ["[" /* LEFT_BRACKET */]: [4 /* IN_SUB_PATH */, 2 /* INC_SUB_PATH_DEPTH */],
      ["]" /* RIGHT_BRACKET */]: [1 /* IN_PATH */, 3 /* PUSH_SUB_PATH */],
      ["o" /* END_OF_FAIL */]: 8 /* ERROR */,
      ["l" /* ELSE */]: [4 /* IN_SUB_PATH */, 0 /* APPEND */]
  };
  pathStateMachine[5 /* IN_SINGLE_QUOTE */] = {
      ["'" /* SINGLE_QUOTE */]: [4 /* IN_SUB_PATH */, 0 /* APPEND */],
      ["o" /* END_OF_FAIL */]: 8 /* ERROR */,
      ["l" /* ELSE */]: [5 /* IN_SINGLE_QUOTE */, 0 /* APPEND */]
  };
  pathStateMachine[6 /* IN_DOUBLE_QUOTE */] = {
      ["\"" /* DOUBLE_QUOTE */]: [4 /* IN_SUB_PATH */, 0 /* APPEND */],
      ["o" /* END_OF_FAIL */]: 8 /* ERROR */,
      ["l" /* ELSE */]: [6 /* IN_DOUBLE_QUOTE */, 0 /* APPEND */]
  };
  /**
   * Check if an expression is a literal value.
   */
  const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
  function isLiteral(exp) {
      return literalValueRE.test(exp);
  }
  /**
   * Strip quotes from a string
   */
  function stripQuotes(str) {
      const a = str.charCodeAt(0);
      const b = str.charCodeAt(str.length - 1);
      return a === b && (a === 0x22 || a === 0x27)
          ? str.slice(1, -1)
          : str;
  }
  /**
   * Determine the type of a character in a keypath.
   */
  function getPathCharType(ch) {
      if (ch === undefined || ch === null) {
          return "o" /* END_OF_FAIL */;
      }
      const code = ch.charCodeAt(0);
      switch (code) {
          case 0x5B: // [
          case 0x5D: // ]
          case 0x2E: // .
          case 0x22: // "
          case 0x27: // '
              return ch;
          case 0x5F: // _
          case 0x24: // $
          case 0x2D: // -
              return "i" /* IDENT */;
          case 0x09: // Tab (HT)
          case 0x0A: // Newline (LF)
          case 0x0D: // Return (CR)
          case 0xA0: // No-break space (NBSP)
          case 0xFEFF: // Byte Order Mark (BOM)
          case 0x2028: // Line Separator (LS)
          case 0x2029: // Paragraph Separator (PS)
              return "w" /* WORKSPACE */;
      }
      return "i" /* IDENT */;
  }
  /**
   * Format a subPath, return its plain form if it is
   * a literal string or number. Otherwise prepend the
   * dynamic indicator (*).
   */
  function formatSubPath(path) {
      const trimmed = path.trim();
      // invalid leading 0
      if (path.charAt(0) === '0' && isNaN(parseInt(path))) {
          return false;
      }
      return isLiteral(trimmed)
          ? stripQuotes(trimmed)
          : "*" /* ASTARISK */ + trimmed;
  }
  /**
   * Parse a string path into an array of segments
   */
  function parse$1(path) {
      const keys = [];
      let index = -1;
      let mode = 0 /* BEFORE_PATH */;
      let subPathDepth = 0;
      let c;
      let key; // eslint-disable-line
      let newChar;
      let type;
      let transition;
      let action;
      let typeMap;
      const actions = [];
      actions[0 /* APPEND */] = () => {
          if (key === undefined) {
              key = newChar;
          }
          else {
              key += newChar;
          }
      };
      actions[1 /* PUSH */] = () => {
          if (key !== undefined) {
              keys.push(key);
              key = undefined;
          }
      };
      actions[2 /* INC_SUB_PATH_DEPTH */] = () => {
          actions[0 /* APPEND */]();
          subPathDepth++;
      };
      actions[3 /* PUSH_SUB_PATH */] = () => {
          if (subPathDepth > 0) {
              subPathDepth--;
              mode = 4 /* IN_SUB_PATH */;
              actions[0 /* APPEND */]();
          }
          else {
              subPathDepth = 0;
              if (key === undefined) {
                  return false;
              }
              key = formatSubPath(key);
              if (key === false) {
                  return false;
              }
              else {
                  actions[1 /* PUSH */]();
              }
          }
      };
      function maybeUnescapeQuote() {
          const nextChar = path[index + 1];
          if ((mode === 5 /* IN_SINGLE_QUOTE */ && nextChar === "'" /* SINGLE_QUOTE */) ||
              (mode === 6 /* IN_DOUBLE_QUOTE */ && nextChar === "\"" /* DOUBLE_QUOTE */)) {
              index++;
              newChar = '\\' + nextChar;
              actions[0 /* APPEND */]();
              return true;
          }
      }
      while (mode !== null) {
          index++;
          c = path[index];
          if (c === '\\' && maybeUnescapeQuote()) {
              continue;
          }
          type = getPathCharType(c);
          typeMap = pathStateMachine[mode];
          transition = typeMap[type] || typeMap["l" /* ELSE */] || 8 /* ERROR */;
          // check parse error
          if (transition === 8 /* ERROR */) {
              return;
          }
          mode = transition[0];
          if (transition[1] !== undefined) {
              action = actions[transition[1]];
              if (action) {
                  newChar = c;
                  if (action() === false) {
                      return;
                  }
              }
          }
          // check parse finish
          if (mode === 7 /* AFTER_PATH */) {
              return keys;
          }
      }
  }
  // path token cache
  const cache = new Map();
  function resolveValue(obj, path) {
      // check object
      if (!isObject(obj)) {
          return null;
      }
      // parse path
      let hit = cache.get(path);
      if (!hit) {
          hit = parse$1(path);
          if (hit) {
              cache.set(path, hit);
          }
      }
      // check hit
      if (!hit) {
          return null;
      }
      // resolve path value
      const len = hit.length;
      let last = obj;
      let i = 0;
      while (i < len) {
          const val = last[hit[i]];
          if (val === undefined) {
              return null;
          }
          last = val;
          i++;
      }
      return last;
  }

  /**
   * Runtime
   *
   * Runtime is low-level API for i18n
   * This module is offered core i18n feature of Intlify project
   */
  const DEFAULT_LINKDED_MODIFIERS = {
      upper: (str) => str.toUpperCase(),
      lower: (str) => str.toLowerCase(),
      capitalize: (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`
  };
  const NOOP_MESSAGE_FUNCTION = () => '';
  function createRuntimeContext(options = {}) {
      const locale = options.locale || 'en-US';
      const fallbackLocales = options.fallbackLocales || [locale];
      const messages = options.messages || { [locale]: {} };
      const compileCache = Object.create(null);
      const modifiers = Object.assign({}, options.modifiers || {}, DEFAULT_LINKDED_MODIFIERS);
      return {
          locale,
          fallbackLocales,
          messages,
          modifiers,
          compileCache
      };
  }
  /*
   * localize
   *
   * use cases
   *    'foo.bar' path -> 'hi {0} !' or 'hi {name} !'
   *
   *    // no argument, context & path only
   *    localize(context, 'foo.bar')
   *
   *    // list argument
   *    localize(context, 'foo.bar', ['kazupon'])
   *    localize(context, 'foo.bar', { list: ['kazupon'] })
   *
   *    // named argument
   *    localize(context, 'foo.bar', { named: { name: 'kazupon' } })
   *
   *    // plural choice number
   *    localize(context, 'foo.bar', 2)
   *    localize(context, 'foo.bar', { plural: 2 })
   *
   *    // plural choice number with name argument
   *    localize(context, 'foo.bar', { named: { name: 'kazupon' } }, 2)
   *    localize(context, 'foo.bar', { named: { name: 'kazupon' }, plural: 2 })
   *
   *    // default message argument
   *    localize(context, 'foo.bar', 'this is default message')
   *    localize(context, 'foo.bar', { default: 'this is default message' })
   *
   *    // default message with named argument
   *    localize(context, 'foo.bar', { named: { name; 'kazupon' } }, 'Hello {name} !')
   *    localize(context, 'foo.bar', { named: { name: 'kazupon' }, default: 'Hello {name} !' })
   *
   *    // use key as default message
   *    localize(context, 'hi {0} !', { list: ['kazupon'] }, true)
   *    localize(context, 'hi {0} !', { list: ['kazupon'], default: true })
   *
   *    // locale
   *    localize(context, 'foo.bar', { locale: 'ja' })
   *
   *    // missing warning option
   *    localize(context, 'foo.bar', { missing: true })
   */
  function localize(context, key, ...args) {
      const { locale, messages, compileCache, modifiers } = context;
      const message = messages[locale];
      if (!isObject(message)) {
          // TODO: should be more designed default
          return key;
      }
      const value = resolveValue(message, key);
      if (!isString(value)) {
          // TODO: should be more designed default
          return key;
      }
      // TODO: need to design resolve message function?
      const resolveMessage = (key) => {
          const fn = compileCache[key];
          if (fn) {
              return fn;
          }
          const val = resolveValue(message, key);
          if (isString(val)) {
              return (compileCache[val] = compile(val));
          }
          else if (isFunction(val)) {
              return val;
          }
          else {
              // TODO: should be implemented warning message
              return NOOP_MESSAGE_FUNCTION;
          }
      };
      const options = {
          modifiers,
          messages: resolveMessage
      };
      if (isObject(args[0])) {
          const obj = args[0];
          if (obj.list) {
              options.list = obj.list;
          }
          if (obj.named) {
              options.named = obj.named;
          }
          if (isNumber(obj.plural)) {
              options.pluralIndex = obj.plural;
          }
      }
      const msg = compileCache[value] || (compileCache[value] = compile(value));
      const msgContext = createMessageContext(options);
      return msg(msgContext);
  }

  /**
   * Composition
   *
   * Composition is composable API for vue-i18n
   * This module is offered composable i18n API for Vue 3
   */
  const GlobalI18nSymbol = Symbol.for('vue-i18n');
  const providers = new Map();
  function createI18nComposer(options = {}) {
      const _locale = options.locale || 'en-US';
      const _fallbackLocales = options.fallbackLocales || [_locale];
      const _data = vue.reactive({
          locale: _locale,
          fallbackLocales: _fallbackLocales,
          messages: options.messages || { [_locale]: {} }
      });
      const getRuntimeContext = () => {
          return createRuntimeContext({
              locale: _data.locale,
              fallbackLocales: _data.fallbackLocales,
              messages: _data.messages
          });
      };
      let _context = getRuntimeContext();
      const t = (key, ...args) => {
          return localize(_context, key, ...args);
      };
      return {
          /* properties */
          // locale
          get locale() { return _data.locale; },
          set locale(val) {
              _data.locale = val;
              _context = getRuntimeContext();
          },
          // fallbackLocales
          get fallbackLocales() { return _data.fallbackLocales; },
          set fallbackLocales(val) {
              _data.fallbackLocales = val;
              _context = getRuntimeContext();
          },
          // messages
          get messages() { return _data.messages; },
          set messages(val) {
              _data.messages = val;
              _context = getRuntimeContext();
          },
          /* methods */
          t
      };
  }
  function getProvider(instance) {
      let current = instance;
      let symbol = providers.get(current);
      while (!symbol) {
          if (!current.parent) {
              symbol = GlobalI18nSymbol;
              break;
          }
          else {
              current = current.parent;
              symbol = providers.get(current);
              if (symbol) {
                  break;
              }
          }
      }
      return symbol;
  }
  // exports vue-i18n composable API
  function useI18n(options = {}) {
      const instance = vue.getCurrentInstance();
      const symbol = !instance ? GlobalI18nSymbol : getProvider(instance);
      return vue.inject(symbol) || createI18nComposer(options);
  }

  // TODO:
  var Interpolate = {
      name: 'i18n'
  };

  // TODO:
  var Number = {
      name: 'i18n-n'
  };

  function hook(el, binding, vnode, prevVNode) {
      // TODO: v-t directive
      // ...
  }

  function applyPlugin(app, legacyI18n, composer) {
      // install components
      app.component(Interpolate.name, Interpolate);
      app.component(Number.name, Number);
      // install directive
      app.directive('t', hook); // TODO:
      // setup global provider
      app.provide(GlobalI18nSymbol, composer);
      // supports compatibility for vue-i18n old style API
      app.mixin({
          beforeCreate() {
              // TODO: should resolve type inference
              const options = this.$options;
              if (options.i18n) { // component local i18n
                  const optionsI18n = options.i18n;
                  // TODO: should be inherited parent options here !
                  // e.g optionsI18n.fallbackLocale = this.$root.proxy.$i18n.fallbackLocale
                  /*
                  if (this.$root && this.$root.proxy && this.$root.proxy.$i18n) {
                    options.i18n.root = this.$root
                    options.i18n.formatter = this.$root.$i18n.formatter
                    options.i18n.fallbackLocale = this.$root.$i18n.fallbackLocale
                    options.i18n.formatFallbackMessages = this.$root.$i18n.formatFallbackMessages
                    options.i18n.silentTranslationWarn = this.$root.$i18n.silentTranslationWarn
                    options.i18n.silentFallbackWarn = this.$root.$i18n.silentFallbackWarn
                    options.i18n.pluralizationRules = this.$root.$i18n.pluralizationRules
                    options.i18n.preserveDirectiveContent = this.$root.$i18n.preserveDirectiveContent
                  }
                  */
                  // TODO: should be merged locale messages from custom blocks
                  /*
                  // init locale messages via custom blocks
                  if (options.__i18n) {
                    try {
                      let localeMessages = {}
                      options.__i18n.forEach(resource => {
                        localeMessages = merge(localeMessages, JSON.parse(resource))
                      })
                      options.i18n.messages = localeMessages
                    } catch (e) {
                      if ("development" !== 'production') {
                        warn(`Cannot parse locale messages via custom blocks.`, e)
                      }
                    }
                  }
                  */
                  // TODO: should be merged sharedMessages
                  /*
                  const { sharedMessages } = options.i18n
                  if (sharedMessages && isPlainObject(sharedMessages)) {
                    options.i18n.messages = merge(options.i18n.messages, sharedMessages)
                  }
                  */
                  this.$i18n = createI18n(optionsI18n);
              }
              else if (this.$root && this.$root.proxy) { // root i18n
                  // TODO: should resolve type inference
                  const instance = this.$root.proxy;
                  this.$i18n = instance.$i18n || legacyI18n;
              }
              else if (this.$parent && this.$parent.proxy) { // parent i18n
                  // TODO: should resolve type inference
                  const instance = this.$parent.proxy;
                  this.$i18n = instance.$i18n || legacyI18n;
              }
              else {
                  this.$i18n = legacyI18n;
              }
              this.$t = (key, ...values) => {
                  return this.$i18n.t(key, values);
              };
              this.$tc = (key, ...values) => {
                  // TODO:
                  return key;
              };
              this.$te = (key, locale) => {
                  // TODO:
                  return true;
              };
              this.$d = (value, ...args) => {
                  // TODO:
                  return {};
              };
              this.$n = (value, ...args) => {
                  // TODO:
                  return {};
              };
          }
      });
  }

  // NOTE: disable (occured build error when use rollup build ...)
  // export const version = 9.0.0-alpah.0 // eslint-disable-line
  const intlDefined = typeof Intl !== 'undefined';
  const availabilities = {
      dateTimeFormat: intlDefined && typeof Intl.DateTimeFormat !== 'undefined',
      numberFormat: intlDefined && typeof Intl.NumberFormat !== 'undefined'
  };
  function createI18n(options = {}) {
      const composer = createI18nComposer(options);
      const i18n = {
          get locale() { return composer.locale; },
          set locale(val) { composer.locale = val; },
          t(key, ...values) {
              let args = values;
              if (values.length === 1) {
                  if (isString(values[0])) {
                      args = [{ locale: values[0] }];
                  }
                  else if (isArray(values[0])) {
                      args = [{ list: values[0] }];
                  }
                  else if (isObject(values[0])) {
                      args = [{ named: values[0] }];
                  }
              }
              else if (values.length === 2) {
                  if (isString(values[0]) && isArray(values[1])) {
                      args = [{ locale: values[0], list: values[1] }];
                  }
                  else if (isString(values[0]) && isObject(values[1])) {
                      args = [{ locale: values[0], named: values[1] }];
                  }
              }
              return composer.t(key, args);
          },
          install(app) {
              applyPlugin(app, i18n, composer);
          }
      };
      return i18n;
  }

  exports.GlobalI18nSymbol = GlobalI18nSymbol;
  exports.availabilities = availabilities;
  exports.compile = compile;
  exports.createCompiler = createCompiler;
  exports.createI18n = createI18n;
  exports.createI18nComposer = createI18nComposer;
  exports.createParser = createParser;
  exports.createRuntimeContext = createRuntimeContext;
  exports.createTokenizer = createTokenizer;
  exports.isArray = isArray;
  exports.isFunction = isFunction;
  exports.isNumber = isNumber;
  exports.isObject = isObject;
  exports.isPlainObject = isPlainObject;
  exports.isPromise = isPromise;
  exports.isString = isString;
  exports.isSymbol = isSymbol;
  exports.localize = localize;
  exports.objectToString = objectToString;
  exports.parse = parse;
  exports.toDisplayString = toDisplayString;
  exports.toTypeString = toTypeString;
  exports.useI18n = useI18n;

  return exports;

}({}, Vue));
