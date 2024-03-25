import Button from "@/components/Button"
import Field from "@/components/Field"
import Layout from "@/components/layout/NLayout"
import { Form, Formik } from "formik"
import * as yup from "yup"
import { GET_AREAS, ADD_AREA, UPDATE_AREA } from "../admin/adminQueries.gql"

import { useMutation, useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { uiCTX } from "../_app"

import { ViewState } from "@devexpress/dx-react-scheduler"
import {
  Scheduler,
  Appointments,
  MonthView,
} from "@devexpress/dx-react-scheduler-material-ui"
// @ts-ignore

const currentDate = "2018-11-01"
const schedulerData = []

const headers = [
  "Nombre",
  "Descripción",
  "Puede aprtarse",
  "Necesita aprovación",
  "Acciones",
]

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
})

const initialValues = {
  name: "",
  description: "",
  reserve: false,
  needsAproval: false,
}

// @ts-ignore
const Areas = (props) => {
  const ui = useContext(uiCTX)
  const [startDate, setStartDate] = useState(new Date())
  const { query, push } = useRouter()
  const { error, data, loading, called } = useQuery(GET_AREAS)

  const selectedArea =
    query.edit && data?.areas?.length > 0
      ? // @ts-ignore
        data.areas.find((i) => i.id === query.edit)
      : initialValues

  const [createArea, createAreaCTX] = useMutation(ADD_AREA, {
    refetchQueries: [GET_AREAS],
  })
  const [updateArea, updateAreaCTX] = useMutation(UPDATE_AREA, {
    refetchQueries: [GET_AREAS],
  })
  return (
    <Layout>
      <>
        <div className="w-2/6 p-2 md:shrink-0">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            <Formik
              enableReinitialize={true}
              validationSchema={schema}
              initialValues={{ ...selectedArea }}
              onSubmit={async (variables, { resetForm }) => {
                if (query.edit) {
                  const editVariables = { ...variables, id: query.edit }
                  try {
                    const { data } = await updateArea({
                      variables: editVariables,
                    })
                  } catch (error) {
                    console.log("error >> ", error)
                  }
                  if (data) {
                    push("./comon-areas")
                    //@ts-ignore
                    resetForm(initialValues)
                  }
                  return
                }

                try {
                  const { data } = await createArea({ variables })

                  //@ts-ignore
                  if (data) resetForm(initialValues)
                } catch {}
              }}
            >
              {(formik) => (
                <Form className="mb-8 mt-8 flex flex-col">
                  <Field
                    label="Nombre del area"
                    name="name"
                    id="name"
                    type="text"
                    errors={formik.errors}
                  />
                  <Field
                    // @ts-ignore
                    as="textarea"
                    label="Descripción o reglas"
                    name="description"
                    id="description"
                    type="multiline"
                    errors={formik.errors}
                  />

                  <Field
                    name="reserve"
                    id="reserve"
                    label="Se puede apartar?"
                    type="checkbox"
                    errors={formik.errors}
                  />
                  <Field
                    name="needsAproval"
                    id="needsAproval"
                    label="Necesita aprovacion?"
                    type="checkbox"
                    errors={formik.errors}
                  />

                  <Button title={query.edit ? "Editar" : "Agregar"} />
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="w-4/6 p-2">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {/* <Paper>
              <Scheduler data={schedulerData}>
                <ViewState currentDate={currentDate} />
                <MonthView /> <Appointments />
              </Scheduler>
            </Paper> */}
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Areas
