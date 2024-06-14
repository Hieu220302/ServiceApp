import React from 'react';

const formatTimestamp = timestamp => {
  const date = new Date(timestamp);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(-2);

  return `${day}${month}${year}`;
};

export const countWeekdays = (startDate, numberOfDays) => {
  let count = 0;
  let date = new Date(startDate);
  let code = [];
  for (let i = 0; i < numberOfDays; i++) {
    let dayOfWeek = date.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      count++;
      code.push(formatTimestamp(date));
    }
    date.setDate(date.getDate() + 1);
  }

  return {code, count};
};

export const countEveryOtherDays = (startDate, numberOfDays) => {
  let count = 0;
  let date = new Date(startDate);
  let code = [];
  let check = true;
  for (let i = 0; i < numberOfDays; i++) {
    if (check) {
      count++;
      code.push(formatTimestamp(date));
    }
    check = !check;
    date.setDate(date.getDate() + 1);
  }

  return {code, count};
};

export const countAllMonthDays = (startDate, numberOfDays) => {
  let count = 0;
  let date = new Date(startDate);
  let code = [];
  for (let i = 0; i < numberOfDays; i++) {
    count++;
    code.push(formatTimestamp(date));
    date.setDate(date.getDate() + 1);
  }

  return {code, count};
};

export const countWeekendDays = (startDate, numberOfDays) => {
  let count = 0;
  let date = new Date(startDate);
  let code = [];
  for (let i = 0; i < numberOfDays; i++) {
    let dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      count++;
      code.push(formatTimestamp(date));
    }
    date.setDate(date.getDate() + 1);
  }

  return {code, count};
};

const cashRegister = (price, quantity, time, isServicePacks, dateSelect) => {
  let totalFunds = price;
  let props = {code: [formatTimestamp(dateSelect)], count: 1};
  if (quantity > 1) totalFunds = totalFunds + (price * quantity * 10) / 100;
  if (time > 1) totalFunds = totalFunds + (price * time * 20) / 100;
  if (isServicePacks > 0) {
    if (isServicePacks === 1) props = countWeekendDays(dateSelect, 30);
    if (isServicePacks === 2) props = countEveryOtherDays(dateSelect, 30);
    if (isServicePacks === 3) props = countWeekdays(dateSelect, 30);
    if (isServicePacks === 4) props = countAllMonthDays(dateSelect, 30);
    totalFunds = (totalFunds * props.count * 95) / 100;
  }
  return {
    days: props.count,
    totalFunds: totalFunds.toLocaleString(),
    code: props.code,
  };
};

export const cashRegisterCustom = (price, quantity, time, days) => {
  let totalFunds = price;
  if (quantity > 1) totalFunds = totalFunds + (price * quantity * 10) / 100;
  if (time > 1) totalFunds = totalFunds + (price * time * 20) / 100;
  if (days > 15) totalFunds = (totalFunds * days * 95) / 100;
  else totalFunds = totalFunds * days;
  return totalFunds.toLocaleString();
};
export default cashRegister;
