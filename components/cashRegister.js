import React from 'react';
const cashRegister = (price, quantity, time, isServicePacks) => {
  // console.log(price, '-', quantity, '-', time);
  let totalFunds = price;
  if (quantity > 1) totalFunds = totalFunds + (price * quantity * 10) / 100;
  if (time > 1) totalFunds = totalFunds + (price * time * 20) / 100;
  if (isServicePacks) totalFunds = (totalFunds * 30 * 95) / 100;
  return totalFunds.toLocaleString();
};
export default cashRegister;
