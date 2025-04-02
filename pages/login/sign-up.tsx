import Field from '@/components/Field'
import { Formik, Form, FieldArray } from 'formik'

import { useEffect, useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  CREATE_USER,
  LOG_IN,
  IS_LOGGED,
  GENERATE_PAYMENTS,
  USER_EXISTS,
  IS_USER,
} from './queries.gql'

import { createUser, addProperties, makePayment } from '../schema'
import Button from '@/components/Button'
import Layout from '@/components/layout/login'
import Link from 'next/link'

// @ts-ignore: Unreachable code error
const CreateUser = ({ goNext, goBack, data, final, haveUser, loading }) => {
  return (
    <Formik
      initialValues={{ ...data }}
      validationSchema={createUser}
      onSubmit={(props) => {
        if (!final) {
          goNext(props)
        }
      }}
    >
      {(formik) => (
        <Form>
          <h3>Hola!</h3>
          <p>
            Si eres residente de Cumbres 7 en Altozano Tabasco, llegaste al
            lugar indicado para llevar un seguimiento de tus pagos y un
            historial de los mismos.
          </p>
          <p>
            Manten tus aportaciones al día y sigue recibiendo todos los
            servicios
          </p>

          <h4>1. Crear un usuario</h4>
          <p>
            Para poder relacionar tus propiedades crea un usuario, por favor usa
            el celular que tienes en whats app.
          </p>

          <Field
            id="name"
            label="Nombre completo"
            placeholder="Roberto Jirafales"
            name="name"
            type="text"
            errors={formik.errors}
          />
          <Field
            id="email"
            label="Correo electronico"
            placeholder="roberto@gmail.com"
            name="email"
            type="text"
            errors={
              haveUser
                ? {
                    email: 'Es posible que que éste correo ya haya sido usado.',
                  }
                : { ...formik.errors }
            }
          />
          <Field
            id="phone"
            label="Telefono celular (usar el mismo que en el chat)"
            placeholder="9931000000"
            name="phone"
            type="text"
            errors={
              haveUser
                ? {
                    phone:
                      'Es posible que que éste telefono ya haya sido usado.',
                  }
                : { ...formik.errors }
            }
          />
          <Field
            id="password"
            label="Pin (4 digitos)"
            placeholder="0000"
            name="password"
            type="text"
            errors={formik.errors}
          />
          {haveUser ? (
            <>
              <p>
                {' '}
                Al parecer este usuario ya existe, por favor{' '}
                <Link
                  className="font-medium text-teal-700 hover:text-teal-800 hover:underline"
                  href="/login"
                >
                  ingrese con su usuario y contraseña
                </Link>{' '}
                o si olvido su contraseña{' '}
                <Link
                  className="font-medium text-teal-700 hover:text-teal-800 hover:underline"
                  href="/login/recovery"
                >
                  recuperela aqui.
                </Link>
              </p>
              <p>
                {' '}
                Si piensa que hay un error, contacte al administrador por favor
              </p>

              <p>O simplemente intente con otro correo y/o celular...</p>
              <Button loading={loading} title="Intentar de nuevo" />
            </>
          ) : (
            <Button loading={loading} title="Crear Usuario" />
          )}
        </Form>
      )}
    </Formik>
  )
}

// @ts-ignore: Unreachable code error
const AddProperties = ({ goNext, data, final }) => {
  const [signUpMutation, signUpMutationData] = useMutation(CREATE_USER)
  const [loginMutation, loginMutationData] = useMutation(LOG_IN, {
    refetchQueries: [{ query: IS_LOGGED }, { query: GENERATE_PAYMENTS }],
  })

  return (
    <div>
      <Formik
        initialValues={{ ...data, properties: [{ lot: '', square: '' }] }}
        initialErrors={{
          properties: [{ lot: 'required', square: 'required' }],
        }}
        validationSchema={addProperties}
        onSubmit={async (props) => {
          if (!final) {
            goNext(props)
          }
          try {
            const creation = await signUpMutation({ variables: props })

            if (creation.data.createUser) {
              loginMutation({
                variables: { email: props.email, password: props.password },
              })
            }
          } catch (error) {
            console.log('error ', error)
          }
        }}
      >
        {(formik) => (
          <FieldArray
            name="properties"
            // @ts-ignore: Unreachable code error
            initialErrors={true}
            render={(arrayProps) => (
              <Form>
                <div className="w-full text-center">
                  <h4>2. Agrege sus propiedades</h4>

                  {formik?.values.properties.length > 0 &&
                    // @ts-ignore: Unreachable code error
                    formik?.values.properties.map((property, index) => {
                      const {
                        errors: { properties: errors },
                      } = arrayProps.form
                      return (
                        <div key={index} className="m-4 mb-8">
                          {/*  @ts-ignore */}
                          <Field
                            as="select"
                            name={`properties[${index}].square`}
                            label="Manzana"
                          >
                            <option value="">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                          </Field>
                          {/* @ts-ignore: Unreachable code error */}
                          {errors?.[index]?.square && (
                            // @ts-ignore: Unreachable code error
                            <p className="error table-cell">
                              {
                                // @ts-ignore: Unreachable code error
                                errors[index].square
                              }
                            </p>
                          )}

                          {/*  @ts-ignore */}
                          <Field
                            as="select"
                            name={`properties[${index}].lot`}
                            label="Lote"
                          >
                            {
                              // @ts-ignore: Unreachable code error
                              [...Array(25).keys()].map((i) => (
                                <option key={i} value={i ? i : ''}>
                                  {i}
                                </option>
                              ))
                            }
                          </Field>
                          {
                            // @ts-ignore: Unreachable code error
                            errors?.[index]?.lot && (
                              <p className="error table-cell">
                                {
                                  // @ts-ignore: Unreachable code error
                                  errors[index].lot
                                }
                              </p>
                            )
                          }

                          <div>
                            {
                              // @ts-ignore: Unreachable code error
                              formik.values.properties.length - 1 === index &&
                              // @ts-ignore: Unreachable code error
                              !arrayProps.form.errors.properties?.[index] ? (
                                <Button
                                  onClick={() =>
                                    arrayProps.push({ lot: '', square: '' })
                                  }
                                  title="Agregar propiedad"
                                />
                              ) : (
                                index !== 0 &&
                                index ===
                                  formik.values.properties.length - 1 && (
                                  <Button
                                    title="Quitar propiedad"
                                    onClick={() => arrayProps.pop()}
                                  />
                                )
                              )
                            }
                          </div>
                        </div>
                      )
                    })}

                  <Button title="Hacer el primer pago" />
                </div>
              </Form>
            )}
          />
        )}
      </Formik>
    </div>
  )
}

// @ts-ignore: Unreachable code error
const MakePayment = ({ goNext, data, final }) => (
  <Formik
    initialValues={{ ...data }}
    validationSchema={makePayment}
    onSubmit={(props) => {
      if (!final) {
        goNext(props)
      } else {
        console.log('submit', data)
      }
    }}
  >
    {(formik) => (
      <Form>
        <div className="row">
          <h4>3. Haga su primer pago</h4>

          <p>
            Si ya ha agregado al menos una propiedad podrá hacer su primer
            pago...
          </p>

          <Button title="Hacer mi primer pagos" />
        </div>
      </Form>
    )}
  </Formik>
)

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setStep] = useState(0)
  const [userExist, setUserExist] = useState(false)

  const [form, setData] = useState({})

  const [userExists, { error, data, loading, called }] = useLazyQuery(IS_USER)

  const goBack = () => {
    if (currentStep >= 1) {
      setStep(currentStep - 1)
    }
  }
  var haveUser = null
  // @ts-ignore: Unreachable code error
  const goNext = async (props) => {
    const { email, phone } = props
    haveUser = await userExists({
      variables: {
        email,
        phone,
      },
    })

    setUserExist(haveUser.data?.isUser)
    if (haveUser.data?.isUser === false) {
      setData({ ...form, ...props })
      setStep(currentStep + 1)
      return
    }
  }

  const steps = [
    // @ts-ignore: Unreachable code error
    <CreateUser
      loading={loading}
      key={1}
      goNext={goNext}
      goBack={goBack}
      data={form}
      haveUser={userExist}
    />,
    <AddProperties key={2} goNext={goNext} data={form} final={true} />,
  ]

  const SVG = ({
    currentStep,
    thisStep,
  }: {
    currentStep: number
    thisStep: number
  }) => {
    if (currentStep >= thisStep) {
      return (
        <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-900 ring-0 ring-white sm:ring-8 dark:bg-blue-900 dark:ring-gray-900">
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-blue-100 dark:text-blue-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      )
    }
    return (
      <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 ring-0 ring-white sm:ring-8 dark:bg-gray-700 dark:ring-gray-900">
        <svg
          aria-hidden="true"
          className="h-3 w-3 text-gray-800 dark:text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
    )
  }

  return (
    <Layout>
      <>
        <ol className="mt-10 flex items-center">
          <li key={1} className="relative mb-6 w-full">
            <div className="flex items-center">
              <SVG currentStep={currentStep + 1} thisStep={1} />
              <div className="flex h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="mt-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Paso 1
              </h3>
            </div>
          </li>

          <li key={2} className="relative mb-6 w-full">
            <div className="flex items-center">
              <SVG currentStep={currentStep + 1} thisStep={2} />
            </div>
            <div className="mt-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Paso 2
              </h3>
            </div>
          </li>
        </ol>

        <>{steps[currentStep]}</>
      </>
    </Layout>
  )
}

export default SignUp
