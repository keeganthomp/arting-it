const SET_BUYER = 'SET_BUYER'

export default (state = initialState, action) => {
  const { payload, type } = action
  switch (type) {
  case SET_BUYER:
    return { ...state, ...payload }
  default:
    return state
  }
}


const initialState = {
  
}
