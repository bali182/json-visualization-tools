import {
  BOOLEAN, COLON, COMMA, NULL, NUMBER, STRING, LINEBREAK, LEFT_CURLY_BRACKET,
  LEFT_SQUARE_BRACKET, RIGHT_CURLY_BRACKET, RIGHT_SQUARE_BRACKET, WHITESPACE
} from './tokenTypes'
import { current, done, previous, sliceFrom, consume, failWithMessage } from './utils'

// state inspecting primitives
function matches({ input, index }, string = '') {
  if (index + string.length > input.length) {
    return false
  }
  for (let i = 0; i < string.length; i++) {
    if (string[i] !== input[index + i]) {
      return false
    }
  }
  return true
}

function failAtPosition(char, index) {
  failWithMessage(`Unexpected character '${char}' at position ${index}`)
}

function newToken(type, value, raw, index) {
  return { type, value, raw, index }
}

function consumeWord(state, index) {
  let char = current(state)
  while (!done(state) && char !== ' ' && char !== '\t' && char !== '\r' && char !== '\n' && char !== '}' && char !== ']' && char !== ',') {
    consume(state, 1)
    char = current(state)
  }
  return sliceFrom(state, index)
}

function consumeText(state, type, raw, index, value = raw) {
  const token = newToken(type, value, raw, index)
  consume(state, raw.length)
  return token
}

function consumeNewLine(state, char, index) {
  if (char === '\n') {
    return consumeText(state, LINEBREAK, char, index)
  } else if (matches(state, '\r\n')) {
    return consumeText(state, LINEBREAK, '\r\n', index)
  } else {
    return failAtPosition(char, index)
  }
}

function consumeWhiteSpace(state, _, index) {
  consume(state, 1)
  loop: while (!done(state)) {
    switch (current(state)) {
      case ' ':
      case '\t':
        consume(state, 1)
        break
      default:
        break loop
    }
  }
  const value = sliceFrom(state, index)
  return newToken(WHITESPACE, value, value, index)
}

function consumeString(state, char, index) {
  consume(state, 1) // consume the leading "
  while (!done(state)) {
    switch (current(state)) {
      case '"':
        if (previous(state) !== '\\') {
          consume(state, 1)
          const value = sliceFrom(state, index)
          return newToken(STRING, JSON.parse(value), value, index)
        }
        break
      default:
        // noop
        break
    }
    consume(state, 1)
  }
  return failAtPosition(char, index)
}

function consumeToken(state) {
  const char = current(state)
  const index = state.index
  switch (char) {
    case '{': return consumeText(state, LEFT_CURLY_BRACKET, char, index)
    case '}': return consumeText(state, RIGHT_CURLY_BRACKET, char, index)
    case '[': return consumeText(state, LEFT_SQUARE_BRACKET, char, index)
    case ']': return consumeText(state, RIGHT_SQUARE_BRACKET, char, index)
    case ':': return consumeText(state, COLON, char, index)
    case ',': return consumeText(state, COMMA, char, index)
    case '"': return consumeString(state, char, index)
    case '\n':
    case '\r': return consumeNewLine(state, char, index)
    case '\t':
    case ' ': return consumeWhiteSpace(state, char, index)
    default:
      if (matches(state, 'true')) {
        return consumeText(state, BOOLEAN, 'true', index, true)
      } else if (matches(state, 'false')) {
        return consumeText(state, BOOLEAN, 'false', index, false)
      } else if (matches(state, 'null')) {
        return consumeText(state, NULL, 'null', index, null)
      } else {
        const value = consumeWord(state, index)
        return newToken(NUMBER, JSON.parse(value), value, index)
      }
  }
}

function tokenize(input) {
  if (typeof input !== 'string') {
    failWithMessage(`Unexpected input ${input} of type  ${typeof input}. Expected string.`)
  }
  const state = { input, index: 0 }
  const tokens = []
  while (!done(state)) {
    const token = consumeToken(state)
    tokens.push(token)
  }
  return tokens
}

export default tokenize
