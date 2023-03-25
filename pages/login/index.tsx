import { Form, Formik } from "formik"
import Link from "next/link"
import * as yup from "yup"
import Field from "@/components/Field"
import { LOG_IN, IS_LOGGED } from "./queries.gql"
import { useMutation } from "@apollo/client"
import Layout from "./Layout"

const schema = yup.object().shape({
  password: yup.number().required().positive().integer(),
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
  const isLoading = loading

  return (
    // @ts-ignore: Unreachable code error
    <Layout>
      <div className="row">
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={(variables) => loginMutation({ variables })}
        >
          {(formik) => (
            <Form>
              <h3>Bienvenido!</h3>
              <p>
                A traves de este sitio podras llevar el control de tus pagos y
                aportaciones.
              </p>
              <Field
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
                errors={formik.errors}
              />

              <label htmlFor="remindme">
                <input id="remindme" name="remindme" type="checkbox" />
                &nbsp;Recuerdame
              </label>

              <button
                className={`button-primary ${isLoading && "loading"}`}
                type="submit"
                value="Ingresar"
              >
                Ingresar
              </button>
            </Form>
          )}
        </Formik>
        <div className="row">
          <Link href="/login/sign-up">Aun no tengo usuario...</Link>
        </div>
        <div className="row">
          <Link href="/login/recovery">No recuerdo mi contraseña</Link>
        </div>
      </div>
    </Layout>
  )
}
