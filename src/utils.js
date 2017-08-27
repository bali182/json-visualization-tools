export function done(state) {
  return state.index >= state.input.length
}
export function current(state) {
  return state.input[state.index]
}
export function previous(state) {
  return state.input[state.index - 1]
}
export function sliceFrom(state, index) {
  return state.input.slice(index, state.index)
}
export function consume(state, amount = 1) {
  state.index += amount
}
export function failWithMessage(message) {
  throw new Error(message)
}
export function uuid4() {
  // from: https://gist.github.com/kaizhu256/4482069
  let uuid = ''
  for (let ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        uuid += '-'
        uuid += (Math.random() * 16 | 0).toString(16)
        break
      case 12:
        uuid += '-'
        uuid += '4'
        break
      case 16:
        uuid += '-'
        uuid += (Math.random() * 4 | 8).toString(16)
        break
      default:
        uuid += (Math.random() * 16 | 0).toString(16)
    }
  }
  return uuid
}
