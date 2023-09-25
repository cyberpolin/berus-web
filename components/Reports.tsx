import { useQuery } from "@apollo/client"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { useState } from "react"
import { GET_REPORTS } from "../pages/dashboard/queries.gql"
import Vouchers from "./Vouchers"

dayjs.locale("es")

const Reports = () => {
  const { data, loading, error } = useQuery(GET_REPORTS)
  const [date, setDate] = useState()

  if (loading) {
    return
  }

  if (data) {
    return data.reports
      .map(({ fecha, reporteUrl }: { fecha: string; reporteUrl: string }) => (
        <div className="transition-75 m-2 w-full rounded bg-slate-500 text-center hover:bg-slate-600">
          <div
            key={fecha}
            className="transition-75 w-full rounded bg-slate-700 text-center transition-colors hover:bg-slate-800"
          >
            <a href={reporteUrl} target="blank">
              <div className=" center rounded bg-slate-900 bg-opacity-75 p-4 text-3xl uppercase text-slate-300">
                {dayjs(fecha).format("MMMM")}
              </div>
              <div className="center text-l p-4 uppercase text-slate-400">
                {dayjs(fecha).format("YYYY")}
              </div>
            </a>
          </div>
          <a
            href="#"
            onClick={() => {
              setDate(fecha)
            }}
          >
            Comprobantes
          </a>
          {date === fecha && <Vouchers date={date} />}
        </div>
      ))
      .reverse()
  }
}

export default Reports
