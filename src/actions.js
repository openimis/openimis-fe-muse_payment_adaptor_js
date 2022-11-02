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