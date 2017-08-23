export const done = state => state.index >= state.input.length
export const current = state => state.input[state.index]
export const previous = state => state.input[state.index - 1]
export const sliceFrom = (state, index) => state.input.slice(index, state.index)
export const consume = (state, amount = 1) => {
  state.index += amount
}
