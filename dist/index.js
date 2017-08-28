'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var LEFT_CURLY_BRACKET = 'LEFT_CURLY_BRACKET';
var RIGHT_CURLY_BRACKET = 'RIGHT_CURLY_BRACKET';
var LEFT_SQUARE_BRACKET = 'LEFT_SQUARE_BRACKET';
var RIGHT_SQUARE_BRACKET = 'RIGHT_SQUARE_BRACKET';
var COLON = 'COLON';
var COMMA = 'COMMA';
var STRING = 'STRING';
var NUMBER = 'NUMBER';
var BOOLEAN = 'BOOLEAN';
var NULL = 'NULL';
var WHITESPACE = 'WHITESPACE';
var LINEBREAK = 'LINEBREAK';

var T = Object.freeze({
	LEFT_CURLY_BRACKET: LEFT_CURLY_BRACKET,
	RIGHT_CURLY_BRACKET: RIGHT_CURLY_BRACKET,
	LEFT_SQUARE_BRACKET: LEFT_SQUARE_BRACKET,
	RIGHT_SQUARE_BRACKET: RIGHT_SQUARE_BRACKET,
	COLON: COLON,
	COMMA: COMMA,
	STRING: STRING,
	NUMBER: NUMBER,
	BOOLEAN: BOOLEAN,
	NULL: NULL,
	WHITESPACE: WHITESPACE,
	LINEBREAK: LINEBREAK
});

var KEY = 'KEY';
var VALUE = 'VALUE';

var S = Object.freeze({
	KEY: KEY,
	VALUE: VALUE
});

function done(state) {
  return state.index >= state.input.length;
}
function current(state) {
  return state.input[state.index];
}
function previous(state) {
  return state.input[state.index - 1];
}
function sliceFrom(state, index) {
  return state.input.slice(index, state.index);
}
function consume(state) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  state.index += amount;
}
function failWithMessage(message) {
  throw new Error(message);
}
function uuid4() {
  // from: https://gist.github.com/kaizhu256/4482069
  var uuid = '';
  for (var ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        uuid += '-';
        uuid += (Math.random() * 16 | 0).toString(16);
        break;
      case 12:
        uuid += '-';
        uuid += '4';
        break;
      case 16:
        uuid += '-';
        uuid += (Math.random() * 4 | 8).toString(16);
        break;
      default:
        uuid += (Math.random() * 16 | 0).toString(16);
    }
  }
  return uuid;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

// state inspecting primitives
function matches(_ref) {
  var input = _ref.input,
      index = _ref.index;
  var string = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (index + string.length > input.length) {
    return false;
  }
  for (var i = 0; i < string.length; i++) {
    if (string[i] !== input[index + i]) {
      return false;
    }
  }
  return true;
}

function failAtPosition(char, index) {
  failWithMessage('Unexpected character \'' + char + '\' at position ' + index);
}

function newToken(type, value, raw, index) {
  return { type: type, value: value, raw: raw, index: index };
}

function consumeWord(state, index) {
  var char = current(state);
  while (!done(state) && char !== ' ' && char !== '\t' && char !== '\r' && char !== '\n' && char !== '}' && char !== ']' && char !== ',') {
    consume(state, 1);
    char = current(state);
  }
  return sliceFrom(state, index);
}

function consumeText(state, type, raw, index) {
  var value = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : raw;

  var token = newToken(type, value, raw, index);
  consume(state, raw.length);
  return token;
}

function consumeNewLine(state, char, index) {
  if (char === '\n') {
    return consumeText(state, LINEBREAK, char, index);
  } else if (matches(state, '\r\n')) {
    return consumeText(state, LINEBREAK, '\r\n', index);
  } else {
    return failAtPosition(char, index);
  }
}

function consumeWhiteSpace(state, _, index) {
  consume(state, 1);
  loop: while (!done(state)) {
    switch (current(state)) {
      case ' ':
      case '\t':
        consume(state, 1);
        break;
      default:
        break loop;
    }
  }
  var value = sliceFrom(state, index);
  return newToken(WHITESPACE, value, value, index);
}

function consumeString(state, char, index) {
  consume(state, 1); // consume the leading "
  while (!done(state)) {
    switch (current(state)) {
      case '"':
        if (previous(state) !== '\\') {
          consume(state, 1);
          var value = sliceFrom(state, index);
          return newToken(STRING, JSON.parse(value), value, index);
        }
        break;
      default:
        // noop
        break;
    }
    consume(state, 1);
  }
  return failAtPosition(char, index);
}

function consumeToken(state) {
  var char = current(state);
  var index = state.index;
  switch (char) {
    case '{':
      return consumeText(state, LEFT_CURLY_BRACKET, char, index);
    case '}':
      return consumeText(state, RIGHT_CURLY_BRACKET, char, index);
    case '[':
      return consumeText(state, LEFT_SQUARE_BRACKET, char, index);
    case ']':
      return consumeText(state, RIGHT_SQUARE_BRACKET, char, index);
    case ':':
      return consumeText(state, COLON, char, index);
    case ',':
      return consumeText(state, COMMA, char, index);
    case '"':
      return consumeString(state, char, index);
    case '\n':
    case '\r':
      return consumeNewLine(state, char, index);
    case '\t':
    case ' ':
      return consumeWhiteSpace(state, char, index);
    default:
      if (matches(state, 'true')) {
        return consumeText(state, BOOLEAN, 'true', index, true);
      } else if (matches(state, 'false')) {
        return consumeText(state, BOOLEAN, 'false', index, false);
      } else if (matches(state, 'null')) {
        return consumeText(state, NULL, 'null', index, null);
      } else {
        var value = consumeWord(state, index);
        return newToken(NUMBER, JSON.parse(value), value, index);
      }
  }
}

function tokenize(input) {
  if (typeof input !== 'string') {
    failWithMessage('Unexpected input ' + input + ' of type  ' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)) + '. Expected string.');
  }
  var state = { input: input, index: 0 };
  var tokens = [];
  while (!done(state)) {
    var token = consumeToken(state);
    tokens.push(token);
  }
  return tokens;
}

function consumeObject(state, path) {
  consume(state, 1); // consume {
  while (!done(state) && current(state).type !== RIGHT_CURLY_BRACKET) {
    consumeKeyValuePair(state, path);
  }
  var closeCurlyToken = current(state);
  if (closeCurlyToken.type !== RIGHT_CURLY_BRACKET) {
    failWithMessage('expected ' + RIGHT_CURLY_BRACKET + ', got ' + closeCurlyToken.type);
  }
  consume(state, 1); // consume }
}

function consumeArray(state, path) {
  consume(state, 1); // consume [
  var index = 0;
  while (!done(state) && current(state).type !== RIGHT_SQUARE_BRACKET) {
    consumeValue(state, path.concat([index++])); // consume value
    var possibleComma = current(state);
    if (possibleComma.type === COMMA) {
      consume(state, 1); // consume ,
    }
  }
  var closeSquareToken = current(state);
  if (closeSquareToken.type !== RIGHT_SQUARE_BRACKET) {
    failWithMessage('expected ' + RIGHT_SQUARE_BRACKET + ', got ' + closeSquareToken.type);
  }
  consume(state, 1); // consume ]
}

function consumeKeyValuePair(state, path) {
  var keyToken = current(state);
  if (keyToken.type !== STRING) {
    failWithMessage('expected ' + STRING + ', got ' + keyToken.type);
  }
  keyToken.semantics = {
    path: Array.from(path),
    type: KEY
  };

  consume(state, 1); // consume "key"

  var possibleColonToken = current(state);
  if (possibleColonToken && possibleColonToken.type !== COLON) {
    failWithMessage('expected ' + COLON + ', got ' + possibleColonToken.type);
  }

  consume(state, 1); // consume :

  consumeValue(state, path.concat([keyToken.value])); // consume value

  var possibleCommaToken = current(state);

  if (possibleCommaToken && possibleCommaToken.type === COMMA) {
    consume(state, 1); // consume ,
  }
}

function consumeTerminal(state, path) {
  var token = current(state);
  token.semantics = {
    path: Array.from(path),
    type: VALUE
  };
  consume(state, 1);
}

function consumeValue(state, path) {
  var token = current(state, path);
  switch (token.type) {
    case LEFT_CURLY_BRACKET:
      consumeObject(state, path);
      break;
    case LEFT_SQUARE_BRACKET:
      consumeArray(state, path);
      break;
    case STRING:
    case NUMBER:
    case BOOLEAN:
    case NULL:
      consumeTerminal(state, path);
      break;
    default:
      throw failWithMessage('unexpected token ' + token.type);
  }
}

function semantics(tokens) {
  var state = {
    index: 0,
    input: tokens.filter(function (_ref) {
      var type = _ref.type;
      return type !== WHITESPACE && type !== LINEBREAK;
    })
  };
  consumeValue(state, []);
  if (!done(state)) {
    throw failWithMessage('expected EOF, got ' + current(state).type);
  }
  return tokens;
}

function splitToLines(tokens) {
  var lines = [];
  var line = [];
  tokens.forEach(function (token) {
    if (token.type === LINEBREAK) {
      lines.push(line);
      line = [];
    } else {
      line.push(token);
    }
  });
  if (line.length > 0) {
    lines.push(line);
  }
  return lines;
}

function process(_ref) {
  var _ref$lines = _ref.lines,
      lines = _ref$lines === undefined ? false : _ref$lines,
      _ref$semantics = _ref.semantics,
      semantics$$1 = _ref$semantics === undefined ? false : _ref$semantics;

  return function (input) {
    var tokens = tokenize(input);

    tokens.forEach(function (token) {
      return Object.assign(token, { id: uuid4() });
    });

    if (semantics$$1) {
      semantics(tokens);
    }
    return lines ? splitToLines(tokens) : tokens;
  };
}

var TokenTypes = T;
var SemanticTypes = S;

exports.TokenTypes = TokenTypes;
exports.SemanticTypes = SemanticTypes;
exports.process = process;
