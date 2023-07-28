const createSlice = require("@reduxjs/toolkit").createSlice;
const mail = require("../scripts/sendEmail");

const initialState = {
  error: false,
  busy: false,
  payload: {},
  lastFunctionCall: "",
  errorFunction: "",
  interval: 90000,
  getGamesList: false,
  checkIfLeague: false,
  getGamesData: false,
  getH2HStats: false,
  insertToDB: false,
};

const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    setError: (state, action) => {
      if (action.payload) {
        // mail(action.payload);
        state.error = true;
      } else {
        state.error = false;
      }
    },
    setPayload: (state, action) => {
      state.payload = { ...state.payload, ...action.payload };
    },
    setErrorFunction: (state, action) => {
      state.errorFunction = action.payload;
    },
    setLastFunctionCall: (state, action) => {
      1;
      state.lastFunctionCall = action.payload;
    },
    setProcessComplete: (state, action) => {
      state[action.payload[0]] = action.payload[1];
    },
    setBusy: (state, action) => {
      if (action.payload === false) {
        state.busy = false;
      } else {
        state.busy = !state.busy;
      }
    },
    setReset: (state) => {
      state.error = false;
      state.busy = false;
      state.payload = {};
      state.lastFunctionCall = "";
      state.errorFunction = "";
      state.interval = 90000;
      state.getGamesList = false;
      state.checkIfLeague = false;
      state.getGamesData = false;
      state.getH2HStats = false;
      state.insertToDB = false;
    },
  },
});

const {
  setError,
  setPayload,
  setErrorFunction,
  setLastFunctionCall,
  setProcessComplete,
  setBusy,
  setReset,
} = globalSlice.actions;
const globalSliceReducer = globalSlice.reducer;

module.exports = {
  setError,
  setReset,
  setBusy,
  setProcessComplete,
  setPayload,
  globalSlice,
  setErrorFunction,
  setLastFunctionCall,
  globalSliceReducer,
};
