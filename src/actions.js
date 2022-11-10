import {
    graphql,
    decodeId,
    formatQuery,
    formatPageQuery,
    formatPageQueryWithCount,
    formatGQLString,
    formatMutation,
  } from "@openimis/fe-core";

export function fetchHFBankAccountInfo(mm, healthFacilityUuid) {
    let filters = [
      `healthFacility_Uuid: "${healthFacilityUuid}"`,
    ];
    let projections = [
        "isDeleted",
        "accountName",
        "bankAccount",
        "bankName",
        "bic",
        "uuid",
    ];
    const payload = formatPageQuery("hfBankInformation", filters, projections);
    return graphql(payload, "HF_BANK_INFORMATION");
}


export function sendMuseRequestPayment(bills, clientMutationLabel, clientMutationDetails = null) {
  let billsUuids = `billUuids: ["${bills.map(c => c.id).join("\",\"")}"]`
  let mutation = formatMutation(
    "sendMusePaymentRequest",
    billsUuids,
    clientMutationLabel,
    clientMutationDetails
  );
  var requestedDateTime = new Date();
  bills.forEach(c => c.clientMutationId = mutation.clientMutationId);
  return graphql(
    mutation.payload,
    ['MUSE_PAYMENT_REQUEST_REQ', 'MUSE_PAYMENT_REQUEST_RESP', 'MUSE_PAYMENT_REQUEST_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      clientMutationDetails: !!clientMutationDetails ? JSON.stringify(clientMutationDetails) : null,
      requestedDateTime
    }
  )
}
