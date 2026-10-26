export const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");
export const uid = () =>
  window.crypto?.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(16).slice(2);
