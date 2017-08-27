import {
  LEFT_CURLY_BRACKET, RIGHT_CURLY_BRACKET, LEFT_SQUARE_BRACKET, RIGHT_SQUARE_BRACKET,
  WHITESPACE, LINEBREAK, STRING, COLON, NUMBER, BOOLEAN, NULL, COMMA
} from './tokenTypes'
import { KEY, VALUE } from './semanticTypes'
import { current, done, consume, failWithMessage } from './utils'

function consumeObject(state, path) {
  consume(state, 1) // consume {
  while (!done(state) && current(state).type !== RIGHT_CURLY_BRACKET) {
    consumeKeyValuePair(state, path)
  }
  const closeCurlyToken = current(state)
  if (closeCurlyToken.type !== RIGHT_CURLY_BRACKET) {
    failWithMessage(`expected ${RIGHT_CURLY_BRACKET}, got ${closeCurlyToken.type}`)
  }
  consume(state, 1) // consume }
}

function consumeArray(state, path) {
  consume(state, 1) // consume [
  let index = 0
  while (!done(state) && current(state).type !== RIGHT_SQUARE_BRACKET) {
    consumeValue(state, path.concat([index++])) // consume value
    const possibleComma = current(state)
    if (possibleComma.type === COMMA) {
      consume(state, 1) // consume ,
    }
  }
  const closeSquareToken = current(state)
  if (closeSquareToken.type !== RIGHT_SQUARE_BRACKET) {
    failWithMessage(`expected ${RIGHT_SQUARE_BRACKET}, got ${closeSquareToken.type}`)
  }
  consume(state, 1) // consume ]
}

function consumeKeyValuePair(state, path) {
  const keyToken = current(state)
  if (keyToken.type !== STRING) {
    failWithMessage(`expected ${STRING}, got ${keyToken.type}`)
  }
  keyToken.semantics = {
    path: Array.from(path),
    type: KEY
  }

  consume(state, 1) // consume "key"

  const possibleColonToken = current(state)
  if (possibleColonToken && possibleColonToken.type !== COLON) {
    failWithMessage(`expected ${COLON}, got ${possibleColonToken.type}`)
  }

  consume(state, 1) // consume :

  consumeValue(state, path.concat([keyToken.value])) // consume value

  const possibleCommaToken = current(state)

  if (possibleCommaToken && possibleCommaToken.type === COMMA) {
    consume(state, 1) // consume ,
  }
}

function consumeTerminal(state, path) {
  const token = current(state)
  token.semantics = {
    path: Array.from(path),
    type: VALUE
  }
  consume(state, 1)
}

function consumeValue(state, path) {
  const token = current(state, path)
  switch (token.type) {
    case LEFT_CURLY_BRACKET:
      consumeObject(state, path)
      break
    case LEFT_SQUARE_BRACKET:
      consumeArray(state, path)
      break
    case STRING:
    case NUMBER:
    case BOOLEAN:
    case NULL:
      consumeTerminal(state, path)
      break
    default:
      throw failWithMessage(`unexpected token ${token.type}`)
  }
}

export default function semantics(tokens) {
  const state = {
    index: 0,
    input: tokens.filter(({ type }) => type !== WHITESPACE && type !== LINEBREAK),
  }
  consumeValue(state, [])
  if (!done(state)) {
    throw failWithMessage(`expected EOF, got ${current(state).type}`)
  }
  return tokens
}
