const {
  ADD_AMOUNT_ON_ACCOUNT,
  REMOVE_AMOUNT_FROM_ACCOUNT
} = require("./accountActions");

module.exports = function accountAmount(state = { value: 0 }, action) {
  switch (action.type) {
    case ADD_AMOUNT_ON_ACCOUNT:
      return { value: state.value + action.value };
    case REMOVE_AMOUNT_FROM_ACCOUNT:
      return { value: state.value - action.value };
    default:
      return state;
  }
};
