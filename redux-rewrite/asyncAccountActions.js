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

// New code
// For the fun, it simulates the same process
// than Paypal when you want to verify your account
function verifyAccount() {
	return (dispatch) => {
		dispatch(removeAmountOnAccount(0.30));

    // Simulate asynchronous treatment
		setTimeout(() => {
			dispatch(addAmountOnAccount(0.30));
		}, 1000);
	}
}

module.exports = {
  ADD_AMOUNT_ON_ACCOUNT,
  REMOVE_AMOUNT_FROM_ACCOUNT,

	addAmountOnAccount,
	removeAmountOnAccount,
	verifyAccount
};
