import Field from "@/components/Field"
import { Formik, Form } from "formik"
import * as yup from "yup"
import Link from "next/link"
import { useState } from "react"
import Button from "@/components/Button"

const schema = yup.object().shape({
  email: yup.string().email().required(),
})

const initialValues = {
  email: "",
}

// @ts-ignore: Unreachable code error
const submit = (props, setIsLoading) => {
  console.log("props >> ", props)
  setIsLoading(true)
}

export default function () {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(props) => {
          console.log("pprops >> ", props)
          submit(props, setIsLoading)
        }}
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
            <Button title="Recuperar mi contraseña" className="mx-auto my-2" />
            <p>
              Si aun no tienes una cuenta, por favor{" "}
              <Link
                className="font-medium  text-teal-700 text-teal-800 hover:underline"
                href="/login/sign-up"
              >
                crea una
              </Link>
              , si ya la tienes y estas aqui por error,{" "}
              <Link
                className="font-medium  text-teal-700 text-teal-800 hover:underline"
                href="/login"
              >
                regresa a la pantalla de acceso.
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}
