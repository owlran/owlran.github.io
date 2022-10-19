const padZero = (n: number) => `${n}`.padStart(2, '0');

const formatDatetime = (datetime: string) => {
  const dateObj = new Date(datetime);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  const yyyymmdd = `${year}/${padZero(month)}/${padZero(day)}`;
  return yyyymmdd;
};

export default formatDatetime;
