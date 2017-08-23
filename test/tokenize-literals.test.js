import { BOOLEAN, NULL, STRING, NUMBER } from '../src/tokens'
import { expectToken } from './utils'

describe('tokenize literals', () => {
  it('should tokenize true', () => {
    expectToken({ type: BOOLEAN, value: true })('true')
  })

  it('should tokenize false', () => {
    expectToken({ type: BOOLEAN, value: false })('false')
  })

  it('should tokenize null', () => {
    expectToken({ type: NULL, value: null })('null')
  })

  it('should tokenize strings', () => {
    expectToken({ type: STRING, value: '', raw: '""' })('""')
    expectToken({ type: STRING, value: 'a', raw: '"a"' })('"a"')
    expectToken({ type: STRING, value: 'word', raw: '"word"' })('"word"')
    expectToken({ type: STRING, value: 'this is a sentence.', raw: '"this is a sentence."' })('"this is a sentence."')
    // TODO more string tests
  })

  it('should tokenize numbers', () => {
    expectToken({ type: NUMBER, value: 0, raw: '0' })('0')
    expectToken({ type: NUMBER, value: 123, raw: '123' })('123')
    expectToken({ type: NUMBER, value: -0.1, raw: '-0.1' })('-0.1')
    expectToken({ type: NUMBER, value: 0.123, raw: '0.123' })('0.123')
    expectToken({ type: NUMBER, value: -10e2, raw: '-10e2' })('-10e2')
    expectToken({ type: NUMBER, value: 0.123e2, raw: '0.123e2' })('0.123e2')
    expectToken({ type: NUMBER, value: -123456789, raw: '-123456789' })('-123456789')
    // TODO more number tests
  })
})
