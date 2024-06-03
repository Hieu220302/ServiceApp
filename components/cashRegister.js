import React from 'react';

const countWeekdays = (startDate, numberOfDays) => {
  let count = 0;
  let date = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
    let dayOfWeek = date.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      count++;
    }
    date.setDate(date.getDate() + 1);
  }

  return count;
};

const countWeekendDays = (startDate, numberOfDays) => {
  let count = 0;
  let date = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
    let dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      count++;
    }
    date.setDate(date.getDate() + 1);
  }

  return count;
};

const cashRegister = (price, quantity, time, isServicePacks, dateSelect) => {
  let totalFunds = price;
  let days = 1;
  if (quantity > 1) totalFunds = totalFunds + (price * quantity * 10) / 100;
  if (time > 1) totalFunds = totalFunds + (price * time * 20) / 100;
  if (isServicePacks === 1) {
    days = countWeekendDays(dateSelect, 30);
    totalFunds = (totalFunds * days * 95) / 100;
  }
  if (isServicePacks === 2) {
    days = 15;
    totalFunds = (totalFunds * 15 * 95) / 100;
  }
  if (isServicePacks === 3) {
    days = countWeekdays(dateSelect, 30);
    totalFunds = (totalFunds * days * 95) / 100;
  }
  if (isServicePacks === 4) {
    days = 30;
    totalFunds = (totalFunds * 30 * 95) / 100;
  }
  return {totalFunds: totalFunds.toLocaleString(), days: days};
};
export default cashRegister;
