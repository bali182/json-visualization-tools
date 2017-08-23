import tokenize from './tokenizer'
import addSemantics from './semantics'
import { LINEBREAK } from './tokenTypes'

const splitToLines = tokens => {
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

const process = ({ lines = false, semantics = false }) => input => {
  const tokens = tokenize(input)
  if (semantics) {
    addSemantics(tokens)
  }
  return lines ? splitToLines(tokens) : tokens
}

export default process
