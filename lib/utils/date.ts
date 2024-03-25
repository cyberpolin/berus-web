import dayjs from "dayjs"
import locateData from "dayjs/plugin/localeData"
import es from "dayjs/locale/es-mx"

dayjs.extend(locateData)
dayjs.locale(es)
dayjs().localeData()

const today = dayjs()
const initialDate = dayjs("2023-01-01T12:00:00Z")

const monthsLength = today.diff(initialDate, "month")
const months = Array.from({ length: monthsLength + 1 }, (_, i) => {
  return initialDate.add(i, "month")
})

export { months }
