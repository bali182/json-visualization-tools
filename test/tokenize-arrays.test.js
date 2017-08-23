import { LEFT_SQUARE_BRACKET, RIGHT_SQUARE_BRACKET, COMMA, STRING, BOOLEAN, NULL, NUMBER } from '../src/tokenTypes'
import { createExpectTokens } from './utils'

const expectTokens = createExpectTokens({ lines: false, semantics: false })

describe('tokenize arrays', () => {
  it('should tokenize empty array', () => {
    expectTokens([
      { type: LEFT_SQUARE_BRACKET },
      { type: RIGHT_SQUARE_BRACKET },
    ])('[]')
  })

  it('should tokenize array with primitives', () => {
    expectTokens([
      { type: LEFT_SQUARE_BRACKET },
      { type: NUMBER, value: 123 },
      { type: COMMA },
      { type: BOOLEAN, value: true },
      { type: COMMA },
      { type: BOOLEAN, value: false },
      { type: COMMA },
      { type: NULL, value: null },
      { type: COMMA },
      { type: STRING, value: 'foo' },
      { type: RIGHT_SQUARE_BRACKET },
    ])('[123,true,false,null,"foo"]')
  })

  it('should tokenize nested arrays', () => {
    expectTokens([
      { type: LEFT_SQUARE_BRACKET },
      { type: LEFT_SQUARE_BRACKET },
      { type: NUMBER, value: 123 },
      { type: RIGHT_SQUARE_BRACKET },
      { type: COMMA },
      { type: LEFT_SQUARE_BRACKET },
      { type: BOOLEAN, value: true },
      { type: COMMA },
      { type: LEFT_SQUARE_BRACKET },
      { type: RIGHT_SQUARE_BRACKET },
      { type: RIGHT_SQUARE_BRACKET },
      { type: RIGHT_SQUARE_BRACKET },
    ])('[[123],[true,[]]]')
  })
})
