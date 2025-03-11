import Button from '@/components/Button'
import Input from '@/components/General/Input'
import Layout from '@/components/layout/NLayout'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

const SurveyForm = () => {
  const { id } = useRouter().query

  const schemaOwner = yup.object().shape({
    name: yup.string().required('El nombre de la encuesta es requerido'),
    estate: yup.string().required('El estado es requerido'),
  })

  const router = useRouter()
  const initialValues = {
    name: '',
    state: '',
  }

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: initialValues,
      validationSchema: schemaOwner,
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        if (id !== 'new') {
          //   await updateOwnerUser({
          //     variables: {
          //       id: id.current,
          //       data: {
          //         name: variables.name,
          //         email: variables.email,
          //         password: variables.password,
          //         phone: variables.phone,
          //         properties: { connect: [{ id: variables.properties }] },
          //       },
          //     },
          // })
          console.log('updateOwnerUser')
        } else {
          //   await createOwnerUser({
          //     variables: {
          //       data: {
          //         name: variables.name,
          //         email: variables.email,
          //         password: variables.password,
          //         phone: variables.phone,
          //         properties: { connect: [{ id: variables.properties }] },
          //       },
          //     },
          //   })
          console.log('createOwnerUser')
        }
        resetForm()
        router.push('/admin/surveys')
      },
    })

  if (false) {
    return <h1>Loading...</h1>
  }

  return (
    <Layout>
      <div className=" mx-auto w-full max-w-[1000px] px-10 pt-4  ">
        <form onSubmit={handleSubmit} className="flex flex-col  gap-y-8 ">
          <h2 className="font-semi-bold text-2xl">Añade un nuevo proveedor</h2>
          <Input
            placeholder="Nombre de la encusta"
            name="name"
            label="Nombre"
            id="name"
            value={values.name}
            error={errors.name}
            onChange={handleChange}
          />

          <Button
            title="Crear encuesta"
            type="submit"
            disabled={Object.keys(errors).length > 0}
          />
        </form>
      </div>
    </Layout>
  )
}

export default SurveyForm
