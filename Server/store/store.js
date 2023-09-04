const {
  globalSliceReducer,
  setProcessComplete,
  setBusy,
  setError,
} = require("./globalSlice.js");
const configureStore = require("@reduxjs/toolkit").configureStore;

const checkDailayDb = require("../scripts/checkDailayDb.js");
const getGamesList = require("../scripts/getGamesList.js");
const checkIfLeague = require("../scripts/checkIfLeague.js");
const getGamesData = require("../scripts/getGamesData.js");
const getH2HStats = require("../scripts/getH2HStats.js");
const insertToDB = require("../scripts/db/insertData.js");

const utils = {
  checkIfLeague,
  getGamesData,
  getH2HStats,
  checkDailayDb,
  insertToDB,
  getGamesList
};

class storeInit {
  static init() {
    if (this.store) {
      return this.store;
    }
    return (this.store = configureStore({
      reducer: {
        globalState: globalSliceReducer,
      },
    }));
  }
  store = configureStore({
    reducer: {
      globalState: globalSliceReducer,
    },
  });
}
const store = storeInit.init();

const unsubscribe = store.subscribe(() => {
  if (
    store.getState().globalState.getGamesList &&
    !store.getState().globalState.error &&
    !store.getState().globalState.busy &&
    !store.getState().globalState.checkIfLeague
  ) {
    utils.checkIfLeague(store.getState().globalState.payload, store);
  } else if (
    store.getState().globalState.checkIfLeague &&
    !store.getState().globalState.error &&
    !store.getState().globalState.busy &&
    !store.getState().globalState.getGamesData
  ) {
    utils.getGamesData(store.getState().globalState.payload, store);
  } else if (
    store.getState().globalState.getGamesData &&
    !store.getState().globalState.error &&
    !store.getState().globalState.busy &&
    !store.getState().globalState.getH2HStats
  ) {
    utils.getH2HStats(store.getState().globalState.payload, store);
  } else if (
    store.getState().globalState.getH2HStats &&
    !store.getState().globalState.error &&
    !store.getState().globalState.busy &&
    !store.getState().globalState.insertToDB
  ) {
    utils.insertToDB(store.getState().globalState.payload, store);
  } else if (store.getState().globalState.error) {
    setTimeout(() => {
      store.dispatch(setError());
      utils[store.getState().globalState.lastFunctionCall](
        store.getState().globalState.payload,
        store
      );
    }, 5000);
  }
});

module.exports = {
  store,
  unsubscribe,
};
