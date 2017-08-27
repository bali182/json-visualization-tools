import { expectReconstructability } from './utils'

describe('sanity', () => {
  it('should reconstruct simple structures', () => {
    expectReconstructability('[]')
    expectReconstructability('{}')
    expectReconstructability('1')
    expectReconstructability('"frog"')
    expectReconstructability('true')
    expectReconstructability('false')
    expectReconstructability('null')
  })

  it('should reconstruct complex', () => {
    expectReconstructability('["frog", "cat", "dog"]')
    expectReconstructability('{ "a": 1, "b": 2, "c": true, "d": false, "e": null }')
    expectReconstructability(`{
      "a": 1,
      "b": [
        "a",
        "b", "c"
      ],
      "c": {
        "foo": [1,2, 3],
        "bar": {
          "x": 10
        }
      },
      "d": [
        { "x": null},
        {
          "a": true,
          "b": false
        },
        { "he": "llo"}
      ]
    }`)
  })
})
