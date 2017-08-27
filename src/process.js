import tokenize from './tokenizer'
import addSemantics from './semantics'
import { LINEBREAK } from './tokenTypes'
import { uuid4 } from './utils'

function splitToLines(tokens) {
  const lines = []
  let line = []
  tokens.forEach(token => {
    if (token.type === LINEBREAK) {
      lines.push(line)
      line = []
    } else {
      line.push(token)
    }
  })
  if (line.length > 0) {
    lines.push(line)
  }
  return lines
}

export default function process({ lines = false, semantics = false }) {
  return input => {
    const tokens = tokenize(input)

    tokens.forEach(token => Object.assign(token, { id: uuid4() }))

    if (semantics) {
      addSemantics(tokens)
    }
    return lines ? splitToLines(tokens) : tokens
  }
}
