import createProcessor from '../src/process'

export function createExpectTokens(config) {
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

export function expectReconstructability(input) {
  const process = createProcessor({ lines: false, semantics: false })
  const tokens = process(input)
  const lengthSum = tokens.map(({ raw }) => raw.length).reduce((a, b) => a + b, 0)
  const reconstructed = tokens.map(({ raw }) => raw).join('')
  expect(lengthSum).toBe(input.length)
  expect(reconstructed).toBe(input)
}
