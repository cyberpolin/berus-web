import { Form, Formik } from "formik"
import Link from "next/link"
import * as yup from "yup"
import Field from "@/components/Field"
import { LOG_IN, IS_LOGGED, TEMP_CREATE_USER, IS_USER } from "./queries.gql"
import { useLazyQuery, useMutation } from "@apollo/client"
import Layout from "../../components/layout/login"
import Button from "@/components/Button"

import Image from "next/image"
import { useRef } from "react"

const schema = yup.object().shape({
  password: yup.number().required().positive().integer().min(4),
  phone: yup.number().positive().min(10),
  email: yup.string().email().required(),
})

const initialValues = {
  email: "",
  password: "",
}

export default function () {
  const [loginMutation, { data, loading, error }] = useMutation(LOG_IN, {
    refetchQueries: [IS_LOGGED],
  })
  console.log("error", error)
  const [signUpMutation, signUpMutationData] = useMutation(TEMP_CREATE_USER, {
    refetchQueries: [IS_LOGGED],
  })

  const [isUser, { data: haveUser }] = useLazyQuery(IS_USER)

  const delay = useRef()

  return (
    // @ts-ignore: Unreachable code error
    <Layout>
      <div className="flex flex-col text-center ">
        <Image
          src="/square-logo.png"
          width={250}
          height={250}
          alt="Cumbre Siete, Altozano Tabasco"
          style={{
            alignSelf: "center",
            display: "inline",
          }}
        />
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (variables) => {
            const { data } = await loginMutation({ variables })
            console.log("error" > error)
            if (
              data?.authenticateUserWithPassword?.message ===
              "Authentication failed."
            ) {
              await isUser({
                variables: { email: variables.email },
              })
              await signUpMutation({ variables })
              await loginMutation({ variables })
              // reset()
            }
          }}
        >
          {(formik) => {
            //formik.handleChange((e) => console.log(e))
            return (
              <Form className="mb-8 mt-8 flex flex-col">
                <Field
                  //remove this later
                  //@ts-ignore
                  onChange={async (e) => {
                    formik.handleChange(e)
                    console.log("changed")
                    if (!formik.errors.email && e.target.value.length > 3) {
                      if (delay.current) {
                        clearTimeout(delay.current)
                      }
                      //@ts-ignore
                      delay.current = setTimeout(async () => {
                        const user = await isUser({
                          variables: { email: e.target.value },
                        })
                      }, 1000)
                    }
                  }}
                  label="Correo electronico"
                  name="email"
                  id="email"
                  type="text"
                  errors={formik.errors}
                />

                <Field
                  label="Password"
                  name="password"
                  id="password"
                  type="password"
                  //@ts-ignore
                  maxLength={4}
                  errors={formik.errors}
                />
                {haveUser?.isUser === false && (
                  <Field
                    label="Confirma tu celular por favor"
                    name="phone"
                    id="phone"
                    type="text"
                    //@ts-ignore
                    placeholder="9931888888"
                    //@ts-ignore
                    maxLength={10}
                    errors={formik.errors}
                  />
                )}
                <label htmlFor="remindme">
                  <input id="remindme" name="remindme" type="checkbox" />
                  &nbsp;Recuerdame
                </label>

                <Button title="Ingresar" loading={loading} />
              </Form>
            )
          }}
        </Formik>
        <div className="row">
          <Link
            className="font-medium  text-teal-700 text-teal-800 hover:underline"
            href="/login/sign-up"
          >
            Aun no tengo usuario...
          </Link>
        </div>
        <div className="row">
          <Link
            className="font-medium  text-teal-700 text-teal-800 hover:underline"
            href="/login/recovery"
          >
            No recuerdo mi contraseña
          </Link>
        </div>
      </div>
    </Layout>
  )
}
