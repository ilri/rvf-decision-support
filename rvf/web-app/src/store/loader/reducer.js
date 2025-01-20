const loader = (state, action) => {
  if (typeof state === "undefined") {
    state = {
      isFetching: true,
      data: [],
    };
  }
  switch (action.type) {
    case "START_LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "STOP_LOADING":
      return {
        ...state,
        isLoading: false,
        isFetching: null,
      };
    case "START_GRAPH_LOADING":
      return {
        ...state,
        graphLoading: true,
      };
    case "STOP_GRAPH_LOADING":
      return {
        ...state,
        graphLoading: false,
        isFetching: null,
      };
    default:
      return state;
  }
};

export default loader;
