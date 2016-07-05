import { Character } from './char';
import { Token, TokenList as TT } from "../labels";

var PlaceHolders,
  Messages,
  Regex,
  source,
  strict,
  index,
  lineNumber,
  lineStart,
  hasLineTerminator,
  lastIndex,
  lastLineNumber,
  lastLineStart,
  startIndex,
  startLineNumber,
  startLineStart,
  scanning,
  length,
  lookahead,
  state,
  extra,
  isBindingElement,
  isAssignmentTarget,
  firstCoverInitializedNameError;

PlaceHolders = {
  ArrowParameterPlaceHolder: 'ArrowParameterPlaceHolder'
};

// Ensure the condition is true, otherwise throw an error.
// This is only to have a better contract semantic, i.e. another safety net
// to catch a logic error. The condition shall be fulfilled in normal case.
// Do NOT use this to enforce a certain condition on any user input.

function assert(condition, message) {
  /* istanbul ignore if */
  if (!condition) {
    throw new Error('ASSERT: ' + message);
  }
}

function isDecimalDigit(ch) {
  return (ch >= 0x30 && ch <= 0x39 || ch === 0x5f); // 0._.9
}

function isHexDigit(ch) {
  return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
}

function isOctalDigit(ch) {
  return '01234567'.indexOf(ch) >= 0;
}

function octalToDecimal(ch) {
  // \0 is not octal escape sequence
  var octal = (ch !== '0'),
    code = '01234567'.indexOf(ch);

  if (index < length && isOctalDigit(source[index])) {
    octal = true;
    code = code * 8 + '01234567'.indexOf(source[index++]);

    // 3 digits are only allowed when string starts
    // with 0, 1, 2, 3
    if ('0123'.indexOf(ch) >= 0 &&
      index < length &&
      isOctalDigit(source[index])) {
      code = code * 8 + '01234567'.indexOf(source[index++]);
    }
  }

  return {
    code: code,
    octal: octal
  };
}

// ECMA-262 11.2 White Space

function isWhiteSpace(ch) {
  return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
    (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
}

// ECMA-262 11.3 Line Terminators

function isLineTerminator(ch) {
  return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
}

// ECMA-262 11.6 Identifier Names and Identifiers

function fromCodePoint(cp) {
  return (cp < 0x10000) ? String.fromCharCode(cp) :
    String.fromCharCode(0xD800 + ((cp - 0x10000) >> 10)) +
    String.fromCharCode(0xDC00 + ((cp - 0x10000) & 1023));
}

function isIdentifierStart(ch) {
  return (ch === 0x24) || (ch === 0x5F) || // $ (dollar) and _ (underscore)
    (ch >= 0x41 && ch <= 0x5A) || // A..Z
    (ch >= 0x61 && ch <= 0x7A) || // a..z
    (ch === 0x5C)
}

function isIdentifierPart(ch) {
  return (ch === 0x24) || (ch === 0x5F) || // $ (dollar) and _ (underscore)
    (ch >= 0x41 && ch <= 0x5A) || // A..Z
    (ch >= 0x61 && ch <= 0x7A) || // a..z
    (ch >= 0x30 && ch <= 0x39) || // 0..9
    (ch === 0x5C)
}

// ECMA-262 11.6.2.1 Keywords

function isKeyword(id) {
  return (TT[id] !== void 0);
}

// ECMA-262 11.4 Comments

function addComment(type, value, start, end, loc) {
  var comment;

  assert(typeof start === 'number', 'Comment must have valid position');

  state.lastCommentStart = start;

  comment = {
    type: type,
    value: value
  };
  if (extra.range) {
    comment.range = [start, end];
  }
  if (extra.loc) {
    comment.loc = loc;
  }
  extra.comments.push(comment);
  if (extra.attachComment) {
    extra.leadingComments.push(comment);
    extra.trailingComments.push(comment);
  }
  if (extra.tokenize) {
    comment.type = comment.type + 'Comment';
    if (extra.delegate) {
      comment = extra.delegate(comment);
    }
    extra.tokens.push(comment);
  }
}

function skipSingleLineComment(offset) {
  var start, loc, ch, comment;

  start = index - offset;
  loc = {
    start: {
      line: lineNumber,
      column: index - lineStart - offset
    }
  };

  while (index < length) {
    ch = source.charCodeAt(index);
    ++index;
    if (isLineTerminator(ch)) {
      hasLineTerminator = true;
      if (extra.comments) {
        comment = source.slice(start + offset, index - 1);
        loc.end = {
          line: lineNumber,
          column: index - lineStart - 1
        };
        addComment('Line', comment, start, index - 1, loc);
      }
      if (ch === 13 && source.charCodeAt(index) === 10) {
        ++index;
      }
      ++lineNumber;
      lineStart = index;
      return;
    }
  }

  if (extra.comments) {
    comment = source.slice(start + offset, index);
    loc.end = {
      line: lineNumber,
      column: index - lineStart
    };
    addComment('Line', comment, start, index, loc);
  }
}

function skipMultiLineComment() {
  var start, loc, ch, comment;

  if (extra.comments) {
    start = index - 2;
    loc = {
      start: {
        line: lineNumber,
        column: index - lineStart - 2
      }
    };
  }

  while (index < length) {
    ch = source.charCodeAt(index);
    if (isLineTerminator(ch)) {
      if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
        ++index;
      }
      hasLineTerminator = true;
      ++lineNumber;
      ++index;
      lineStart = index;
    } else if (ch === 0x2A) {
      // Block comment ends with '*/'.
      if (source.charCodeAt(index + 1) === 0x2F) {
        ++index;
        ++index;
        if (extra.comments) {
          comment = source.slice(start + 2, index - 2);
          loc.end = {
            line: lineNumber,
            column: index - lineStart
          };
          addComment('Block', comment, start, index, loc);
        }
        return;
      }
      ++index;
    } else {
      ++index;
    }
  }

  // Ran off the end of the file - the whole thing is a comment
  if (extra.comments) {
    loc.end = {
      line: lineNumber,
      column: index - lineStart
    };
    comment = source.slice(start + 2, index);
    addComment('Block', comment, start, index, loc);
  }
  tolerateUnexpectedToken();
}

function skipComment() {
  var ch, start;
  hasLineTerminator = false;

  start = (index === 0);
  while (index < length) {
    ch = source.charCodeAt(index);

    if (isWhiteSpace(ch)) {
      ++index;
    } else if (isLineTerminator(ch)) {
      hasLineTerminator = true;
      ++index;
      if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
        ++index;
      }
      ++lineNumber;
      lineStart = index;
      start = true;
    } else if (ch === 0x2F) { // U+002F is '/'
      ch = source.charCodeAt(index + 1);
      if (ch === 0x2F) {
        ++index;
        ++index;
        skipSingleLineComment(2);
        start = true;
      } else if (ch === 0x2A) { // U+002A is '*'
        ++index;
        ++index;
        skipMultiLineComment();
      } else {
        break;
      }
    } else if (start && ch === 0x2D) { // U+002D is '-'
      // U+003E is '>'
      if ((source.charCodeAt(index + 1) === 0x2D) && (source.charCodeAt(index + 2) === 0x3E)) {
        // '-->' is a single-line comment
        index += 3;
        skipSingleLineComment(3);
      } else {
        break;
      }
    } else if (ch === 0x3C) { // U+003C is '<'
      if (source.slice(index + 1, index + 4) === '!--') {
        ++index; // `<`
        ++index; // `!`
        ++index; // `-`
        ++index; // `-`
        skipSingleLineComment(4);
      } else {
        break;
      }
    } else {
      break;
    }
  }
}

function scanHexEscape(prefix) {
  var i, len, ch, code = 0;

  len = (prefix === 'u') ? 4 : 2;
  for (i = 0; i < len; ++i) {
    if (index < length && isHexDigit(source[index])) {
      ch = source[index++];
      code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
    } else {
      return '';
    }
  }
  return String.fromCharCode(code);
}

function scanUnicodeCodePointEscape() {
  var ch, code;

  ch = source[index];
  code = 0;

  // At least, one hex digit is required.
  if (ch === '}') {
    throwUnexpectedToken();
  }

  while (index < length) {
    ch = source[index++];
    if (!isHexDigit(ch)) {
      break;
    }
    code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
  }

  if (code > 0x10FFFF || ch !== '}') {
    throwUnexpectedToken();
  }

  return fromCodePoint(code);
}

function codePointAt(i) {
  var cp, first, second;

  cp = source.charCodeAt(i);
  if (cp >= 0xD800 && cp <= 0xDBFF) {
    second = source.charCodeAt(i + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      first = cp;
      cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }

  return cp;
}

function getComplexIdentifier() {
  var cp, ch, id;

  cp = codePointAt(index);
  id = fromCodePoint(cp);
  index += id.length;

  // '\u' (U+005C, U+0075) denotes an escaped character.
  if (cp === 0x5C) {
    if (source.charCodeAt(index) !== 0x75) {
      throwUnexpectedToken();
    }
    ++index;
    if (source[index] === '{') {
      ++index;
      ch = scanUnicodeCodePointEscape();
    } else {
      ch = scanHexEscape('u');
      cp = ch.charCodeAt(0);
      if (!ch || ch === '\\' || !isIdentifierStart(cp)) {
        throwUnexpectedToken();
      }
    }
    id = ch;
  }

  while (index < length) {
    cp = codePointAt(index);
    if (!isIdentifierPart(cp)) {
      break;
    }
    ch = fromCodePoint(cp);
    id += ch;
    index += ch.length;

    // '\u' (U+005C, U+0075) denotes an escaped character.
    if (cp === 0x5C) {
      id = id.substr(0, id.length - 1);
      if (source.charCodeAt(index) !== 0x75) {
        throwUnexpectedToken();
      }
      ++index;
      if (source[index] === '{') {
        ++index;
        ch = scanUnicodeCodePointEscape();
      } else {
        ch = scanHexEscape('u');
        cp = ch.charCodeAt(0);
        if (!ch || ch === '\\' || !isIdentifierPart(cp)) {
          throwUnexpectedToken();
        }
      }
      id += ch;
    }
  }

  return id;
}

function getIdentifier() {
  var start, ch;

  start = index++;
  while (index < length) {
    ch = source.charCodeAt(index);
    if (ch === 0x5C) {
      // Blackslash (U+005C) marks Unicode escape sequence.
      index = start;
      return getComplexIdentifier();
    } else if (ch >= 0xD800 && ch < 0xDFFF) {
      // Need to handle surrogate pairs.
      index = start;
      return getComplexIdentifier();
    }
    if (isIdentifierPart(ch)) {
      ++index;
    } else {
      break;
    }
  }

  return source.slice(start, index);
}

function scanIdentifier() {
  var start, id, type;

  start = index;

  // Backslash (U+005C) starts an escaped character.
  id = (source.charCodeAt(index) === 0x5C) ? getComplexIdentifier() : getIdentifier();

  // There is no keyword or literal with only one character.
  // Thus, it must be an identifier.
  if (id.length === 1) {
    type = Token.Identifier;
  } else if (isKeyword(id)) {
    type = Token.Keyword;
  } else if (id === 'null') {
    type = Token.NullLiteral;
  } else if (id === 'true' || id === 'false') {
    type = Token.BooleanLiteral;
  } else {
    type = Token.Identifier;
  }

  return {
    type: type,
    value: id,
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

// ECMA-262 11.7 Punctuators
function scanPunctuator() {
  var token, str;

  token = {
    type: Token.Punctuator,
    value: '',
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: index,
    end: index
  };

  // Check for most common single-character punctuators.
  str = source[index];
  switch (str) {

    case '(':
      if (extra.tokenize) {
        extra.openParenToken = extra.tokenValues.length;
      }
      ++index;
      break;

    case '{':
      if (extra.tokenize) {
        extra.openCurlyToken = extra.tokenValues.length;
      }
      state.curlyStack.push('{');
      ++index;
      break;

    case '.':
      ++index;
      if (source[index] === '.' && source[index + 1] === '.') {
        // Spread operator: ...
        index += 2;
        str = '...';
      }
      break;

    case '}':
      ++index;
      state.curlyStack.pop();
      break;
    case ')':
    case ';':
    case ',':
    case '[':
    case ']':
    case ':':
    case '?':
    case '~':
      ++index;
      break;

    default:
      var tmp = "";
      var cp = source.charCodeAt(index);
      var res = null;
      while (!isDecimalDigit(cp) && !isWhiteSpace(cp)) {
        tmp += source[index];
        if (TT[tmp] !== void 0) {
          res = tmp;
        }
        index++;
        cp = source.charCodeAt(index);
        if (isNaN(cp)) break;
      };
      if (TT[res] !== void 0 && str !== res) {
        index -= tmp.length - res.length;
        str = res;
      } else {
        if (TT[str] === void 0) {
          token.type = Token.Identifier;
        } else {
          str = res;
          if (tmp.length > str.length) {
            index -= tmp.length - res.length;
          }
        }
      }
    break;

  };

  if (index === token.start) {
    throwUnexpectedToken();
  }

  token.end = index;
  token.value = str;
  return token;
}

// ECMA-262 11.8.3 Numeric Literals

function scanHexLiteral(start) {
  var number = '';

  while (index < length) {
    if (!isHexDigit(source[index])) {
      break;
    }
    number += source[index++];
  }

  if (number.length === 0) {
    throwUnexpectedToken();
  }

  if (isIdentifierStart(source.charCodeAt(index))) {
    throwUnexpectedToken();
  }

  return {
    type: Token.NumericLiteral,
    value: parseInt('0x' + number, 16),
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

function scanBinaryLiteral(start) {
  var ch, number;

  number = '';

  while (index < length) {
    ch = source[index];
    if (ch !== '0' && ch !== '1') {
      break;
    }
    number += source[index++];
  }

  if (number.length === 0) {
    // only 0b or 0B
    throwUnexpectedToken();
  }

  if (index < length) {
    ch = source.charCodeAt(index);
    /* istanbul ignore else */
    if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
      throwUnexpectedToken();
    }
  }

  return {
    type: Token.NumericLiteral,
    value: parseInt(number, 2),
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

function scanOctalLiteral(prefix, start) {
  var number, octal;

  if (isOctalDigit(prefix)) {
    octal = true;
    number = '0' + source[index++];
  } else {
    octal = false;
    ++index;
    number = '';
  }

  while (index < length) {
    if (!isOctalDigit(source[index])) {
      break;
    }
    number += source[index++];
  }

  if (!octal && number.length === 0) {
    // only 0o or 0O
    throwUnexpectedToken();
  }

  if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
    throwUnexpectedToken();
  }

  return {
    type: Token.NumericLiteral,
    value: parseInt(number, 8),
    octal: octal,
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

function isImplicitOctalLiteral() {
  var i, ch;

  // Implicit octal, unless there is a non-octal digit.
  // (Annex B.1.1 on Numeric Literals)
  for (i = index + 1; i < length; ++i) {
    ch = source[i];
    if (ch === '8' || ch === '9') {
      return false;
    }
    if (!isOctalDigit(ch)) {
      return true;
    }
  }

  return true;
}

function scanNumericLiteral() {
  var number, start, ch;

  ch = source[index];
  assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
    'Numeric literal must start with a decimal digit or a decimal point');

  start = index;
  number = '';
  if (ch !== '.') {
    number = source[index++];
    ch = source[index];

    // Hex number starts with '0x'.
    // Octal number starts with '0'.
    // Octal number in ES6 starts with '0o'.
    // Binary number in ES6 starts with '0b'.
    if (number === '0') {
      if (ch === 'x' || ch === 'X') {
        ++index;
        return scanHexLiteral(start);
      }
      if (ch === 'b' || ch === 'B') {
        ++index;
        return scanBinaryLiteral(start);
      }
      if (ch === 'o' || ch === 'O') {
        return scanOctalLiteral(ch, start);
      }

      if (isOctalDigit(ch)) {
        if (isImplicitOctalLiteral()) {
          return scanOctalLiteral(ch, start);
        }
      }
    }

    while (isDecimalDigit(source.charCodeAt(index))) {
      number += source[index++];
    }
    ch = source[index];
  }

  if (ch === '.' && !isIdentifierStart(source.charCodeAt(index + 1))) {
    number += source[index++];
    while (isDecimalDigit(source.charCodeAt(index))) {
      number += source[index++];
    }
    ch = source[index];
  }

  if (ch === 'e' || ch === 'E') {
    number += source[index++];

    ch = source[index];
    if (ch === '+' || ch === '-') {
      number += source[index++];
    }
    if (isDecimalDigit(source.charCodeAt(index))) {
      while (isDecimalDigit(source.charCodeAt(index))) {
        number += source[index++];
      }
    } else {
      throwUnexpectedToken();
    }
  }

  return {
    type: Token.NumericLiteral,
    value: parseFloat(number),
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

// ECMA-262 11.8.4 String Literals

function scanStringLiteral() {
  var str = '',
    quote, start, ch, unescaped, octToDec, octal = false;

  quote = source[index];

  start = index;
  ++index;

  while (index < length) {
    ch = source[index++];

    if (ch === quote) {
      quote = '';
      break;
    } else if (ch === '\\') {
      ch = source[index++];
      if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
        switch (ch) {
          case 'u':
          case 'x':
            if (source[index] === '{') {
              ++index;
              str += scanUnicodeCodePointEscape();
            } else {
              unescaped = scanHexEscape(ch);
              if (!unescaped) {
                throw throwUnexpectedToken();
              }
              str += unescaped;
            }
            break;
          case 'n':
            str += '\n';
            break;
          case 'r':
            str += '\r';
            break;
          case 't':
            str += '\t';
            break;
          case 'b':
            str += '\b';
            break;
          case 'f':
            str += '\f';
            break;
          case 'v':
            str += '\x0B';
            break;
          case '8':
          case '9':
            str += ch;
            tolerateUnexpectedToken();
            break;

          default:
            if (isOctalDigit(ch)) {
              octToDec = octalToDecimal(ch);

              octal = octToDec.octal || octal;
              str += String.fromCharCode(octToDec.code);
            } else {
              str += ch;
            }
            break;
        }
      } else {
        ++lineNumber;
        if (ch === '\r' && source[index] === '\n') {
          ++index;
        }
        lineStart = index;
      }
    } else if (isLineTerminator(ch.charCodeAt(0))) {
      break;
    } else {
      str += ch;
    }
  }

  return {
    type: Token.StringLiteral,
    value: str,
    octal: octal,
    lineNumber: startLineNumber,
    lineStart: startLineStart,
    start: start,
    end: index
  };
}

function isIdentifierName(token) {
  return token.type === Token.Identifier ||
    token.type === Token.Keyword ||
    token.type === Token.BooleanLiteral ||
    token.type === Token.NullLiteral;
}

function advance() {
  var cp, token;

  if (index >= length) {
    return {
      type: Token.EOF,
      lineNumber: lineNumber,
      lineStart: lineStart,
      start: index,
      end: index
    };
  }

  cp = source.charCodeAt(index);

  if (isIdentifierStart(cp)) {
    token = scanIdentifier();
    return token;
  }

  // Very common: ( and ) and ;
  if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
    return scanPunctuator();
  }

  // String literal starts with single quote (U+0027) or double quote (U+0022).
  if (cp === 0x27 || cp === 0x22) {
    return scanStringLiteral();
  }

  // Dot (.) U+002E can also start a floating-point number, hence the need
  // to check the next character.
  if (cp === 0x2E) {
    if (isDecimalDigit(source.charCodeAt(index + 1))) {
      return scanNumericLiteral();
    }
    return scanPunctuator();
  }

  if (isDecimalDigit(cp)) {
    return scanNumericLiteral();
  }

  // Possible identifier start in a surrogate pair.
  if (cp >= 0xD800 && cp < 0xDFFF) {
    cp = codePointAt(index);
    if (isIdentifierStart(cp)) {
      return scanIdentifier();
    }
  }

  //return scanStringLiteral(); // allows any character!!
  return scanPunctuator();
}

function collectToken() {
  var loc, token, value, entry;

  loc = {
    start: {
      line: lineNumber,
      column: index - lineStart
    }
  };

  token = advance();
  loc.end = {
    line: lineNumber,
    column: index - lineStart
  };

  if (token.type !== Token.EOF) {
    value = source.slice(token.start, token.end);
    if (TT[token.value] !== void 0 && Number.isInteger(TT[token.value])) {
      entry = {
        name: TT[token.value],
        range: [token.start, token.end],
        loc: loc
      };
    } else {
      entry = {
        name: token.type,
        value: value,
        range: [token.start, token.end],
        loc: loc
      };
    }
    if (extra.tokenValues) {
      extra.tokenValues.push((entry.type === 'Punctuator' || entry.type === 'Keyword') ? entry.value : null);
    }
    if (extra.tokenize) {
      if (!extra.range) {
        delete entry.range;
      }
      if (!extra.loc) {
        delete entry.loc;
      }
      if (extra.delegate) {
        entry = extra.delegate(entry);
      }
    }
    extra.tokens.push(entry);
  }
  return token;
}

function lex() {
  var token;
  scanning = true;

  lastIndex = index;
  lastLineNumber = lineNumber;
  lastLineStart = lineStart;

  skipComment();

  token = lookahead;

  startIndex = index;
  startLineNumber = lineNumber;
  startLineStart = lineStart;

  lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
  scanning = false;
  return token;
}

function tokenize(code, options, delegate) {
  var toString,
    tokens;

  toString = String;
  if (typeof code !== 'string' && !(code instanceof String)) {
    code = toString(code);
  }

  source = code;
  index = 0;
  lineNumber = (source.length > 0) ? 1 : 0;
  lineStart = 0;
  startIndex = index;
  startLineNumber = lineNumber;
  startLineStart = lineStart;
  length = source.length;
  lookahead = null;
  state = {
    allowIn: true,
    allowYield: true,
    labelSet: {},
    inFunctionBody: false,
    inIteration: false,
    inSwitch: false,
    lastCommentStart: -1,
    curlyStack: []
  };

  extra = {};

  // Options matching.
  options = options || {};

  // Of course we collect tokens here.
  options.tokens = true;
  extra.tokens = [];
  extra.tokenValues = [];
  extra.tokenize = true;
  extra.delegate = delegate;

  // The following two fields are necessary to compute the Regex tokens.
  extra.openParenToken = -1;
  extra.openCurlyToken = -1;

  extra.range = (typeof options.range === 'boolean') && options.range;
  extra.loc = (typeof options.loc === 'boolean') && options.loc;

  if (typeof options.comment === 'boolean' && options.comment) {
    extra.comments = [];
  }
  if (typeof options.tolerant === 'boolean' && options.tolerant) {
    extra.errors = [];
  }

  try {
    peek();
    if (lookahead.type === Token.EOF) {
      return extra.tokens;
    }

    lex();
    while (lookahead.type !== Token.EOF) {
      try {
        lex();
      } catch (lexError) {
        if (extra.errors) {
          recordError(lexError);
          // We have to break on the first error
          // to avoid infinite loops.
          break;
        } else {
          throw lexError;
        }
      }
    }

    tokens = extra.tokens;
    if (typeof extra.errors !== 'undefined') {
      tokens.errors = extra.errors;
    }
  } catch (e) {
    throw e;
  } finally {
    extra = {};
  }
  return tokens;
}

function peek() {
  scanning = true;

  skipComment();

  lastIndex = index;
  lastLineNumber = lineNumber;
  lastLineStart = lineStart;

  startIndex = index;
  startLineNumber = lineNumber;
  startLineStart = lineStart;

  lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
  scanning = false;
}

export {
  tokenize
}