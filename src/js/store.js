
import { createStore } from 'framework7/lite';
import {writable} from "svelte/store";

export const SETTINGS = writable({
  businessName: "Quick Invoice",
  businessLogo: "",
  currency: "₦",
  vat: 0,
})

let randomNumber = Math.floor(Math.random() * 10000);
function date() {
  const date = new Date();
  return date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export const INVOICE = writable({
  id: `QCKINV-${randomNumber}`,
  date: date(),
  billTo: "",
  items: [],
  total: 0,

});
