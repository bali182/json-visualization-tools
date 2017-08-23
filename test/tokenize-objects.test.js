import {
  LEFT_CURLY_BRACKET, RIGHT_CURLY_BRACKET, LEFT_SQUARE_BRACKET,
  RIGHT_SQUARE_BRACKET, COLON, COMMA, STRING, BOOLEAN, NULL, NUMBER
} from '../src/tokens'
import { expectTokens } from './utils'

describe('tokenize objects', () => {
  it('should tokenize empty object', () => {
    expectTokens([
      { type: LEFT_CURLY_BRACKET },
      { type: RIGHT_CURLY_BRACKET },
    ])('{}')
  })

  it('should tokenize object with single key', () => {
    expectTokens([
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, value: 'a' },
      { type: COLON },
      { type: STRING, value: 'b' },
      { type: RIGHT_CURLY_BRACKET },
    ])('{"a":"b"}')
  })

  it('should tokenize object with primitive types', () => {
    expectTokens([
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, value: 'a' },
      { type: COLON },
      { type: STRING, value: 'foo' },
      { type: COMMA },
      { type: STRING, value: 'b' },
      { type: COLON },
      { type: BOOLEAN, value: true },
      { type: COMMA },
      { type: STRING, value: 'c' },
      { type: COLON },
      { type: BOOLEAN, value: false },
      { type: COMMA },
      { type: STRING, value: 'd' },
      { type: COLON },
      { type: NULL, value: null },
      { type: COMMA },
      { type: STRING, value: 'e' },
      { type: COLON },
      { type: NUMBER, value: 10 },
      { type: RIGHT_CURLY_BRACKET },
    ])('{"a":"foo","b":true,"c":false,"d":null,"e":10}')
  })

  it('should tokenize nested object', () => {
    expectTokens([
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, value: 'a' },
      { type: COLON },
      { type: STRING, value: 'foo' },
      { type: COMMA },
      { type: STRING, value: 'b' },
      { type: COLON },
      // nested start
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, value: 'x' },
      { type: COLON },
      { type: STRING, value: 'y' },
      { type: RIGHT_CURLY_BRACKET },
      // nested end
      { type: RIGHT_CURLY_BRACKET },
    ])('{"a":"foo","b":{"x":"y"}}')
  })

  it('should tokenize multi-level nested object', () => {
    expectTokens([
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, value: 'a' },
      { type: COLON },
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, value: 'b' },
      { type: COLON },
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, value: 'c' },
      { type: COLON },
      { type: STRING, value: 'd' },
      { type: RIGHT_CURLY_BRACKET },
      { type: RIGHT_CURLY_BRACKET },
      { type: RIGHT_CURLY_BRACKET },
    ])('{"a":{"b":{"c":"d"}}}')
  })

  it('should tokenize object with an array value', () => {
    expectTokens([
      { type: LEFT_CURLY_BRACKET },
      { type: STRING, value: 'a' },
      { type: COLON },
      { type: LEFT_SQUARE_BRACKET },
      { type: NUMBER, value: 1 },
      { type: COMMA },
      { type: STRING, value: 'foo' },
      { type: COMMA },
      { type: NULL, value: null },
      { type: RIGHT_SQUARE_BRACKET },
      { type: RIGHT_CURLY_BRACKET },
    ])('{"a":[1,"foo",null]}')
  })
})
