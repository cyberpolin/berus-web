import { Form, Formik } from 'formik'
import Link from 'next/link'
import * as yup from 'yup'
import Field from '@/components/Field'
import { LOG_IN, IS_LOGGED, TEMP_CREATE_USER, IS_USER } from './queries.gql'
import { useLazyQuery, useMutation } from '@apollo/client'
import Button from '@/components/Button'
import { useRouter } from 'next/router'
import UseAuth from '@/lib/UseAuth'
import PlainLayout from '@/components/layout/subdivisions/PlainLayout'

import Image from 'next/image'
import { useRef, useEffect } from 'react'

const schema = yup.object().shape({
  password: yup.number().required().positive().integer().min(4),
  phone: yup.number().positive().min(10),
  email: yup.string().email().required(),
})

const initialValues = {
  email: process.env.NEXT_PUBLIC_USR || '',
  password: process.env.NEXT_PUBLIC_PSW || '',
}

export default function Login() {
  const [loginMutation, { data, loading, error }] = useMutation(LOG_IN, {
    refetchQueries: [IS_LOGGED],
  })
  const [signUpMutation, signUpMutationData] = useMutation(TEMP_CREATE_USER, {
    refetchQueries: [IS_LOGGED],
  })

  const [isUser, { data: haveUser }] = useLazyQuery(IS_USER)

  const delay = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { user } = UseAuth()
  useEffect(() => {
    if (user.id) {
      router.push('/subdivisions/')
    }
  }, [user])

  return (
    <PlainLayout>
      <div className="flex w-full max-w-[800px]  flex-col text-center">
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (variables) => {
            const cleanVars = {
              ...variables,
              email: variables.email.replace(' ', ''),
            }
            try {
              const { data } = await loginMutation({ variables: cleanVars })
              if (!!data?.authenticateUserWithPassword.item) {
                router.push('/subdivisions/')
              }
              if (
                data?.authenticateUserWithPassword?.message ===
                'Authentication failed.'
              ) {
                await isUser({
                  variables: { email: cleanVars.email, phone: '0000000000' },
                })
                await signUpMutation({ variables: cleanVars })
                await loginMutation({ variables: cleanVars })
              }
            } catch (e) {
              console.log(e)
            }
          }}
        >
          {(formik) => {
            return (
              <Form className="mb-8 mt-8 flex flex-col">
                <Field
                  onChange={async (e) => {
                    formik.handleChange(e)
                    formik.setFieldValue(
                      'email',
                      e.target.value.replace(' ', '').toLowerCase()
                    )
                    if (!formik.errors.email && e.target.value.length > 3) {
                      if (delay.current) {
                        clearTimeout(delay.current)
                      }
                      delay.current = setTimeout(async () => {
                        const user = await isUser({
                          variables: {
                            email: e.target.value
                              .replace(' ', '')
                              .toLowerCase(),
                            phone: '0000000000',
                          },
                        })
                      }, 1000)
                    }
                  }}
                  label="Correo electronico"
                  name="email"
                  id="email"
                  type="text"
                  errors={formik.errors}
                  value={formik.values.email || ''}
                />

                <Field
                  label="Password2"
                  name="password"
                  id="password"
                  type="password"
                  maxLength={4}
                  errors={formik.errors}
                />
                {haveUser?.isUser === false && (
                  <Field
                    label="Confirma tu celular por favor"
                    name="phone"
                    id="phone"
                    type="text"
                    placeholder="9931888888"
                    maxLength={10}
                    errors={formik.errors}
                  />
                )}
                <label htmlFor="remindme">
                  <input id="remindme" name="remindme" type="checkbox" />
                  &nbsp;Recuerdame
                </label>

                {data?.authenticateUserWithPassword.message &&
                  data?.authenticateUserWithPassword.message ===
                    'Authentication failed.' && (
                    <span className="mb-2 ml-1 inline-block text-left text-sm text-red-800">
                      El usuario o contraseña son incorrectors, intenta{' '}
                      <Link
                        className="font-medium text-teal-700 text-teal-800 hover:underline"
                        href="/login/recovery"
                      >
                        cambiando la contraseña
                      </Link>
                    </span>
                  )}

                <Button title="Ingresar" loading={loading} />
              </Form>
            )
          }}
        </Formik>
        {/* <div className="row">
          <Link
            className="font-medium  text-teal-700 text-teal-800 hover:underline"
            href="/login/sign-up"
          >
            Aun no tengo usuario...
          </Link>
        </div> */}
        <div className="row">
          <Link
            className="font-medium  text-teal-700 text-teal-800 hover:underline"
            href="/subdivisions/login/recovery"
          >
            No recuerdo mi contraseña
          </Link>
        </div>
      </div>
    </PlainLayout>
  )
}
