import {List} from 'immutable';

const initialState = { loading:true}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'INITIAL_LIST':
	  return {
        ...state,
        loading:action.loading,
        news: action.news
      }
    default:
      return state
  }
}

export default reducer