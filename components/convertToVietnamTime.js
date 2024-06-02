const convertToVietnamTime = utcDate => {
  const date = new Date(utcDate);

  const vietnamOffset = 7 * 60 * 60 * 1000;

  const vietnamTime = new Date(date.getTime() + vietnamOffset);

  const day = String(vietnamTime.getUTCDate()).padStart(2, '0');
  const month = String(vietnamTime.getUTCMonth() + 1).padStart(2, '0');
  const year = vietnamTime.getUTCFullYear();
  const hours = String(vietnamTime.getUTCHours()).padStart(2, '0');
  const minutes = String(vietnamTime.getUTCMinutes()).padStart(2, '0');

  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

  return formattedDate;
};

export default convertToVietnamTime;
