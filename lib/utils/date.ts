import dayjs from "dayjs";
import locateData from "dayjs/plugin/localeData";
import es from "dayjs/locale/es-mx";

dayjs.extend(locateData);
dayjs.locale(es);
dayjs().localeData();
const months = dayjs.months();

export { months };
