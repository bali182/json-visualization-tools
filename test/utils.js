import createProcessor from '../src/process'

export const createExpectTokens = config => {
  const process = createProcessor(config)
  return expected => input => {
    const actual = process(input)
    expect(actual).toHaveLength(expected.length)
    expected.forEach((et, i) => {
      const at = actual[i]
      expect(at).toMatchObject(et)
    })
  }
}
