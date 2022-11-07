import messages_en from "./translations/en.json";
import HFBankAccountInfo from "./components/HFBankAccountInfo";
import reducer from "./reducer";
import SendMuseRequestPayment from "./components/SendMuseRequestPayment";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "location.HealthFacility": [HFBankAccountInfo],
  "reducers": [{ key: 'muse_payment_adaptor', reducer }],
  "invoice.bill.SelectionAction": [SendMuseRequestPayment]
}

export const MusePaymentAdaptor = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}