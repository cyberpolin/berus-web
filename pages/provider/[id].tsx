import React, { useState, useEffect } from 'react'
import Button from '@/components/Button'
import Input from '@/components/General/Input'
import Drop from '@/components/layout/Drop'
import Layout from '@/components/layout/NLayout'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { CREATE_PROVIDER_PAYMENT, UPDATE_PROVIDER_PAYMENT } from './queries.gql'
import { useMutation, useQuery } from '@apollo/client'
import { GET_PROVIDER_PAYMENT } from './queries.gql'
import { useRouter } from 'next/router'
import UseAuth from '@/lib/UseAuth'

const schema = yup.object().shape({
  dueAt: yup.date().required('La fecha es requerida'),
  amountWithTax: yup.number().required('El monto es requerido'),
  concept: yup.string().required('El concepto es requerido'),
})

const initialValues = {
  dueAt: new Date().toISOString().split('T')[0],
  amountWithTax: '0',
  concept: '',
}

const InvoiceForm = () => {
  const [updateProviderPayment, { loading: updateLoading }] = useMutation(
    UPDATE_PROVIDER_PAYMENT
  )
  const [createProviderPayment, { loading: createLoading }] = useMutation(
    CREATE_PROVIDER_PAYMENT
  )
  const { user } = UseAuth()
  const { id } = useRouter().query
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  console.log('user', user.id)
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_PROVIDER_PAYMENT, {
    variables: { id },
    skip: id === 'new',
  })

  // Reset image preview when selectedImage changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageDrop = (file: File) => {
    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = async (variables: any) => {
    try {
      const input = {
        ...variables,
        amountWithTax: variables.amountWithTax.toString(),
        dueAt: new Date(variables.dueAt).toISOString(),
        provider: { connect: { id: user.id } },
      }

      console.log('input', input)
      const context = {
        headers: {
          'apollo-require-preflight': 'true',
        },
      }

      if (id === 'new') {
        await createProviderPayment({
          variables: {
            data: {
              ...input,
              image: selectedImage,
            },
          },
          context,
        })
      } else {
        await updateProviderPayment({
          variables: {
            id,
            data: {
              ...input,
              image: selectedImage,
            },
          },
          context,
        })
      }

      // Reset después de enviar
      setSelectedImage(null)
      setImagePreview(null)
      values.amountWithTax = ''
      values.concept = ''
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const providerGetValue = data?.providerPayment
    ? {
        ...data.providerPayment,
        dueAt: data.providerPayment.dueAt?.toString().split('T')[0],
        amountWithTax: data.providerPayment.amountWithTax.toString(),
      }
    : initialValues

  const { values, errors, touched, handleSubmit, handleChange } = useFormik({
    initialValues: providerGetValue,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: onSubmit,
  })

  if (queryLoading) return <h1>Loading...</h1>
  if (queryError) return <h1>Error loading data</h1>

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1000px] px-10 pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-8">
          <h2 className="font-semi-bold text-2xl">Añade una factura nueva.</h2>

          <Input
            placeholder="Fecha limite de pago"
            label="Feha de servicio"
            name="dueAt"
            id="dueAt"
            typeInput="date"
            value={values.dueAt}
            error={touched.dueAt && errors.dueAt}
            onChange={handleChange}
          />

          <Input
            placeholder="Monto a pagar con IVA"
            label="Cantidad Total"
            name="amountWithTax"
            id="amountWithTax"
            typeInput="number"
            value={values.amountWithTax === '0' ? '' : values.amountWithTax}
            error={touched.amountWithTax && errors.amountWithTax}
            onChange={handleChange}
          />

          <Input
            placeholder="Concepto de factura"
            label="Concepto"
            name="concept"
            id="concept"
            typeInput="text"
            value={values.concept}
            error={touched.concept && errors.concept}
            onChange={handleChange}
          />

          <Drop
            cb={handleImageDrop}
            loading={id === 'new' ? createLoading : updateLoading}
            imagePreview={imagePreview}
          />

          <Button
            title={id === 'new' ? 'Agregar Factura' : 'Actualizar Factura'}
            type="submit"
          />
        </form>
      </div>
    </Layout>
  )
}

export default InvoiceForm
