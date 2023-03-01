const INITIAL_STATE = {
  data: null,
  error: null,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_HOTEL_SUCCESS":
      return { ...state, data: action.payload };

    case "GET_HOTEL_FAIL":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};
