import { useQuery } from "@apollo/client"
import dayjs from "dayjs"
import { GET_REPORTS } from "../pages/dashboard/queries.gql"

const Reports = () => {
  const { data, loading, error } = useQuery(GET_REPORTS)
  console.log("data>", data)
  if (loading) {
    return
  }

  if (data) {
    return data.reports.map(
      ({ fecha, reporteUrl }: { fecha: string; reporteUrl: string }) => (
        <p key={reporteUrl}>
          {" "}
          <a href={reporteUrl}>{dayjs(fecha).format("MMM")}</a>
        </p>
      )
    )
  }
}

export default Reports
