import {
    parseData, dispatchMutationReq, dispatchMutationResp, dispatchMutationErr,
    pageInfo, formatServerError, formatGraphQLError
  } from '@openimis/fe-core';
  
  function reducer(
    state = {
      fetchingBankAccountInfo: true,
      fetchedBankAccountInfo: false,
      bankAccountInfo: null,
      errorBankAccountInfo: null,
      mutation: {},
    },
    action,
  ) {
    switch (action.type) {
        case "HF_BANK_INFORMATION_REQ":
          return {
              ...state,
              fetchingBankAccountInfo: true,
              fetchedBankAccountInfo: false,
              bankAccountInfo: null,
              errorBankAccountInfo: null,
          };
        case "HF_BANK_INFORMATION_RESP":
          var hfs = parseData(action.payload.data.hfBankInformation);
          return {
              ...state,
              fetchingBankAccountInfo: false,
              fetchedBankAccountInfo: true,
              bankAccountInfo: !!hfs && hfs.length > 0 ? hfs[0] : null,
              errorBankAccountInfo: formatGraphQLError(action.payload),
          };
        case "HF_BANK_INFORMATION_ERR":
          return {
              ...state,
              fetchingBankAccountInfo: false,
              errorBankAccountInfo: formatServerError(action.payload),
          };
        case 'MUSE_PAYMENT_REQUEST_REQ':
          return dispatchMutationReq(state, action);
        case 'MUSE_PAYMENT_REQUEST_RESP':
          return dispatchMutationResp(state, "sendMusePaymentRequest", action);
        case 'MUSE_PAYMENT_REQUEST_ERR':
          return dispatchMutationErr(state, action);
        default:
            return state;
    }
  }
  
  export default reducer;