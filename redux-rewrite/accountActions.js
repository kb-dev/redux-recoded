const ADD_AMOUNT_ON_ACCOUNT = "ADD_AMOUNT_ON_ACCOUNT";
const REMOVE_AMOUNT_FROM_ACCOUNT = "REMOVE_AMOUNT_FROM_ACCOUNT";

function addAmountOnAccount(amount) {
  return {
    amount,
    type: ADD_AMOUNT_ON_ACCOUNT
  };
}


function removeAmountOnAccount(amount) {
  return {
    amount,
    type: REMOVE_AMOUNT_ON_ACCOUNT
  };
}

module.exports = {
  ADD_AMOUNT_ON_ACCOUNT,
  REMOVE_AMOUNT_FROM_ACCOUNT,

  addAmountOnAccount,
  removeAmountOnAccount
};
