import Field from "@/components/Field"
import { Formik, Form } from "formik"
import * as yup from "yup"
import Link from "next/link"
import { useState } from "react"

const schema = yup.object().shape({
  password: yup.number().required().positive().integer(),
  email: yup.string().email().required(),
})

const initialValues = {
  email: "",
  password: "",
}

// @ts-ignore: Unreachable code error
const submit = (props, setIsLoading) => {
  setIsLoading(true)
}

export default function () {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className="row">
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(props) => submit(props, setIsLoading)}
      >
        {(formik) => (
          // @ts-ignore: Unreachable code error
          <Form>
            <h3>No recuerdo mi contraseña!</h3>
            <p>
              Si no recuerdas tu contraseña por favor confirma que el correo con
              que te diste de alta este bien escrito, nosotros te enviaremos una
              contraseña nueva.
            </p>
            {/*// @ts-ignore: Unreachable code error*/}
            <Field
              label="Correo electronico"
              name="email"
              type="text"
              errors={formik.errors}
            />
            <button
              className={`button-primary ${isLoading && "loading"}`}
              type="submit"
              value="Recuperar mi contraseña"
            >
              Recuperar mi contraseña
            </button>
            <p>
              Si aun no tienes una cuenta, por favor{" "}
              <Link href="/login/sign-up">crea una</Link>, si ya la tienes y
              estas aqui por error,{" "}
              <Link href="/login">regresa a la pantalla de acceso.</Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}
