import tokenize from '../src/tokenizer'
import { BOOLEAN, NULL, STRING, NUMBER } from '../src/tokens'

describe('tokenize literals', () => {
  describe('tokenize booleans', () => {
    const expectSingleToken = (type, raw, value) => input => {
      const tokens = tokenize(input)
      expect(tokenize.length).toBe(1)
      const [token] = tokens
      expect(token.value).toBe(value)
      expect(token.raw).toBe(raw)
      expect(token.type).toBe(type)
    }

    it('should tokenize true', () => {
      expectSingleToken(BOOLEAN, 'true', true)('true')
    })

    it('should tokenize false', () => {
      expectSingleToken(BOOLEAN, 'false', false)('false')
    })

    it('should tokenize null', () => {
      expectSingleToken(NULL, 'null', null)('null')
    })

    it('should tokenize strings', () => {
      expectSingleToken(STRING, '""', '')('""')
      expectSingleToken(STRING, '"a"', 'a')('"a"')
      expectSingleToken(STRING, '"word"', 'word')('"word"')
      expectSingleToken(STRING, '"this is a sentence."', 'this is a sentence.')('"this is a sentence."')
      // TODO more string tests
    })

    it('should tokenize numbers', () => {
      expectSingleToken(NUMBER, '0', 0)('0')
      expectSingleToken(NUMBER, '123', 123)('123')
      expectSingleToken(NUMBER, '-0.1', -0.1)('-0.1')
      expectSingleToken(NUMBER, '0.123', 0.123)('0.123')
      expectSingleToken(NUMBER, '-10e2', -10e2)('-10e2')
      expectSingleToken(NUMBER, '0.123e2', 0.123e2)('0.123e2')
      expectSingleToken(NUMBER, '-123456789', -123456789)('-123456789')
      // TODO more number tests
    })
  })
})
