import { LEFT_CURLY_BRACKET, RIGHT_CURLY_BRACKET, LEFT_SQUARE_BRACKET, RIGHT_SQUARE_BRACKET, STRING, COLON, COMMA } from '../src/tokenTypes'
import { KEY, VALUE } from '../src/semanticTypes'
import { createExpectTokens } from './utils'

const expectTokens = createExpectTokens({ semantics: true, lines: false })

describe('should add semantics', () => {
  it('should add semantics to single key-value pair object', () => {
    expectTokens([
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, semantics: { path: [], type: KEY } },
      { type: COLON },
      { type: STRING, semantics: { path: ['a'], type: VALUE } },
      { type: RIGHT_CURLY_BRACKET },
    ])('{"a":"b"}')
  })

  it('should add semantics to a more complex object', () => {
    expectTokens([
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, semantics: { path: [], type: KEY }, value: 'a' },
      { type: COLON, },
      { type: STRING, semantics: { path: ['a'], type: VALUE }, value: 'b' },
      { type: COMMA },
      { type: STRING, semantics: { path: [], type: KEY }, value: 'c' },
      { type: COLON },
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, semantics: { path: ['c'], type: KEY }, value: 'x' },
      { type: COLON },
      { type: STRING, semantics: { path: ['c', 'x'], type: VALUE }, value: 'y' },
      { type: RIGHT_CURLY_BRACKET, value: '}' },
      { type: COMMA },
      { type: STRING, semantics: { path: [], type: KEY }, value: 'd' },
      { type: COLON },
      { type: LEFT_SQUARE_BRACKET },
      { type: STRING, semantics: { path: ['d', 0], type: VALUE }, value: 'foo' },
      { type: COMMA },
      { type: STRING, semantics: { path: ['d', 1], type: VALUE }, value: 'bar' },
      { type: RIGHT_SQUARE_BRACKET },
      { type: RIGHT_CURLY_BRACKET }
    ])('{"a":"b","c":{"x":"y"},"d":["foo","bar"]}')
  })
})
