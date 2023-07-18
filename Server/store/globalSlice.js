const createSlice = require("@reduxjs/toolkit").createSlice;
const initialState = {
  error: false,
  start: 0,
  payload: {}
};

export const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    setError: (state) => {
      state.error = true;
    },
  },
});

const { setError } = globalSlice.actions;
const  globalSliceReducer = globalSlice.reducer;

module.exports = {
    setError,
    globalSliceReducer
}
