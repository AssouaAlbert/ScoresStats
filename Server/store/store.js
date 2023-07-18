const { globalSliceReducer } = require("./globalSlice.js");
const mail = require("../scripts/sendEmail");

const configureStore = require("@reduxjs/toolkit").configureStore;

const store = configureStore({
  reducer: {
    globalState: globalSliceReducer,
  },
});

const unsubscribe = store.subscribe(() => {

});
// const unsubscribe = store.subscribe((message) => {
//   mail(message);
// });

module.exports = {
  store,
  unsubscribe,
};
