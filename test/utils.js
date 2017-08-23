import tokenize from '../src/tokenizer'

export const expectToken = expectedToken => input => {
  const tokens = tokenize(input)
  expect(tokens).toHaveLength(1)
  const [actualToken] = tokens
  expect(actualToken).toMatchObject(expectedToken)
}

export const expectTokens = expected => input => {
  const actual = tokenize(input)
  expect(actual).toHaveLength(expected.length)
  expected.forEach((et, i) => {
    const at = actual[i]
    expect(at).toMatchObject(et)
  })
}
