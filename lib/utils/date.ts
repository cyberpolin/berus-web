import dayjs from "dayjs";
import locateData from "dayjs/plugin/localeData";
import es from "dayjs/locale/es-mx";

dayjs.extend(locateData);
dayjs.locale(es);
dayjs().localeData();
const months = dayjs.months();

const get2ndMonthHalf = (month: number, fullDate = true) => {
  const thisYear = new Date().getFullYear()
  const today = new Date(thisYear, month, 15)
  const date = dayjs(today).daysInMonth()
  return fullDate ? new Date(thisYear, month, date) : date
}

const get1stMonthHalf = (month: number) => {
  const thisYear = new Date().getFullYear()
  const today = new Date(thisYear, month, 15)
  const date = dayjs(today).daysInMonth() / 2
  return new Date(thisYear, month, date)
}

const getClosest = () => {
  const today = new Date()
  const date = today.getDate()
  const month = today.getMonth()
  const year = today.getFullYear()
  const first = get1stMonthHalf(month)
  const second = get2ndMonthHalf(month)
  if (today === second) {
    return second
  } else {
    return first
  }
}

export { months, get1stMonthHalf, get2ndMonthHalf, getClosest }
