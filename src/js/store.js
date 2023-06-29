
import { createStore } from 'framework7/lite';
import {writable, readable} from "svelte/store";


export const defaultSettings = {
  businessName: "Quick Invoice",
  businessLogo: null,
  currency: "₦",
  vat: 0,
};
export const SETTINGS = readable(defaultSettings, (set) => {
  function update(){
    const data = JSON.parse(localStorage.getItem("settings"));
    if(data) set(data);
  }
  setInterval(update, 1000);
  return () => clearInterval(update);
})

export const CLEAR_SETTINGS = () => {
  console.log(defaultSettings);
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

export const UPDATE_SETTINGS = (data) => {
    localStorage.setItem("settings", JSON.stringify(data));
}


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
