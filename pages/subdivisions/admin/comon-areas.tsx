import Button from '@/components/Button'
import Field from '@/components/Field'
import MainLayout from '@/components/layout/subdivisions/MainLayout'
import { Form, Formik, useFormikContext } from 'formik'
import * as yup from 'yup'
import { GET_AREAS, ADD_AREA, UPDATE_AREA } from '../admin/adminQueries.gql'

import DataTable from '../../../components/DataTable'
import { useMutation, useQuery } from '@apollo/client'
import Loading from '@/components/Loading'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { uiCTX } from '../../_app'
import { StringIterator } from 'lodash'

const headers = [
  'Nombre',
  'Descripción',
  'Puede aprtarse',
  'Necesita aprovación',
  'Acciones',
]

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
})
type areasType = {
  id: String
  name: string
  description?: string
  reserve: boolean
  needsAproval: boolean
}
const initialValues = {
  name: '',
  description: '',
  reserve: false,
  needsAproval: false,
}

// @ts-ignore
const CommonAreas = (props) => {
  const ui = useContext(uiCTX)
  const { query, push } = useRouter()
  const { error, data, loading, called } = useQuery(GET_AREAS)

  const selectedArea =
    query.edit && data?.areas?.length > 0
      ? data.areas.find((i: areasType) => i.id === query.edit)
      : initialValues

  const [createArea, createAreaCTX] = useMutation(ADD_AREA, {
    refetchQueries: [GET_AREAS],
  })
  const [updateArea, updateAreaCTX] = useMutation(UPDATE_AREA, {
    refetchQueries: [GET_AREAS],
  })
  return (
    <MainLayout>
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
                    console.log('error >> ', error)
                  }
                  if (data) {
                    push('./comon-areas')
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
                    //@ts-ignore
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

                  <Button title={query.edit ? 'Editar' : 'Agregar'} />
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="w-4/6 p-2">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {loading && <Loading />}
            {data && called && (
              <DataTable data={data.areas} headers={headers} />
            )}
          </div>
        </div>
      </>
    </MainLayout>
  )
}

export default CommonAreas
