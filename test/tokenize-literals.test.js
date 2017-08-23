import { BOOLEAN, NULL, STRING, NUMBER } from '../src/tokenTypes'
import { createExpectTokens } from './utils'

const expectTokens = createExpectTokens({ lines: false, semantics: false })

describe('tokenize literals', () => {
  it('should tokenize true', () => {
    expectTokens([{ type: BOOLEAN, value: true }])('true')
  })

  it('should tokenize false', () => {
    expectTokens([{ type: BOOLEAN, value: false }])('false')
  })

  it('should tokenize null', () => {
    expectTokens([{ type: NULL, value: null }])('null')
  })

  it('should tokenize strings', () => {
    expectTokens([{ type: STRING, value: '', raw: '""' }])('""')
    expectTokens([{ type: STRING, value: 'a', raw: '"a"' }])('"a"')
    expectTokens([{ type: STRING, value: 'word', raw: '"word"' }])('"word"')
    expectTokens([{ type: STRING, value: 'this is a sentence.', raw: '"this is a sentence."' }])('"this is a sentence."')
    // TODO more string tests
  })

  it('should tokenize numbers', () => {
    expectTokens([{ type: NUMBER, value: 0, raw: '0' }])('0')
    expectTokens([{ type: NUMBER, value: 123, raw: '123' }])('123')
    expectTokens([{ type: NUMBER, value: -0.1, raw: '-0.1' }])('-0.1')
    expectTokens([{ type: NUMBER, value: 0.123, raw: '0.123' }])('0.123')
    expectTokens([{ type: NUMBER, value: -10e2, raw: '-10e2' }])('-10e2')
    expectTokens([{ type: NUMBER, value: 0.123e2, raw: '0.123e2' }])('0.123e2')
    expectTokens([{ type: NUMBER, value: -123456789, raw: '-123456789' }])('-123456789')
    // TODO more number tests
  })
})
