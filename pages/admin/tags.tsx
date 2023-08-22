import Button from "@/components/Button"
import Field from "@/components/Field"
import Layout from "@/components/layout/NLayout"
import { Form, Formik } from "formik"
import * as yup from "yup"
import { CREATE_TAG_IDS } from "../admin/adminQueries.gql"

import { useMutation } from "@apollo/client"
import { useContext } from "react"
import { uiCTX } from "../_app"
import { range } from "lodash"

const headers = [
  "Nombre",
  "Descripción",
  "Puede aprtarse",
  "Necesita aprovación",
  "Acciones",
]

const schema = yup.object().shape({
  initialTag: yup
    .string()
    .matches(/\d{8}/, "El numero de tag se encuentra abajo a la derecha"),
  finalTag: yup
    .string()
    .matches(/\d{8}/, "El numero de tag se encuentra abajo a la derecha"),
})
type areasType = {
  id: String
  name: string
  description?: string
  reserve: boolean
  needsAproval: boolean
}
const initialValues = {
  initialTag: "",
  finalTag: "",
}

// @ts-ignore
const Tags = (props) => {
  const ui = useContext(uiCTX)
  const [updateTags, { loading, data, error }] = useMutation(CREATE_TAG_IDS)
  console.log(">> ", {
    error,
    loading,
    data,
  })

  return (
    <Layout>
      <>
        <div className="w-2/6 p-2 md:shrink-0">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            <Formik
              enableReinitialize={true}
              validationSchema={schema}
              initialValues={initialValues}
              onSubmit={async (variables, { resetForm }) => {
                console.log("variables", variables)

                const { initialTag, finalTag } = variables
                console.log(initialTag)
                console.log(finalTag)
                const tags = range(parseInt(initialTag), parseInt(finalTag) + 1)
                console.log("tags", tags)
                const data = tags.map((t) => ({
                  tagId: `${t}`,
                  isActive: true,
                }))
                console.log("data", data)
                await updateTags({ variables: { data } })
              }}
            >
              {(formik) => (
                <Form className="mb-8 mt-8 flex flex-col">
                  <Field
                    label="Tag Inicial"
                    name="initialTag"
                    id="initialTag"
                    type="text"
                    errors={formik.errors}
                  />
                  <Field
                    label="Tag Final"
                    name="finalTag"
                    id="finalTag"
                    type="text"
                    errors={formik.errors}
                  />

                  <Button title={"Agregar Tags"} />
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="w-4/6 p-2">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            second
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Tags
