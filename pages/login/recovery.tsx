import Field from "@/components/Field"
import { Formik, Form } from "formik"
import * as yup from "yup"
import Link from "next/link"
import { useState } from "react"
import Button from "@/components/Button"
import { useRouter } from "next/router"
import { useLazyQuery } from "@apollo/client"
import { UPDATE_PASSWORD, RECOVERY_PASSWORD } from "./queries.gql"

const schema = yup.object().shape({
  email: yup.string().email().required(),
})

const initialValues = {
  email: "",
}

const recoveryValues = {
  password: "",
  recoveryPassword: "",
}
const recoverySchema = yup.object().shape({
  password: yup
    .string()
    .matches(/^[0-9]{4}$/, "El password debe ser cuatro digitos")
    .required("El Password debe coincidir"),

  repeatPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
})

// @ts-ignore: Unreachable code error
const submit = (props, setIsLoading) => {
  setIsLoading(true)
}

export default function () {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState(null)
  const router = useRouter()
  const recoveryId = router?.query.recoveryId

  const [updatePassword, updatePasswordQuery] = useLazyQuery(UPDATE_PASSWORD, {
    onCompleted: (data) =>
      data?.updatePassword
        ? setTimeout(() => window.location.replace("/login"), 5000)
        : null,
  })
  const [recoverPassword, recoveryPasswordQuery] =
    useLazyQuery(RECOVERY_PASSWORD)

  if (updatePasswordQuery.called && updatePasswordQuery.data?.updatePassword) {
    return (
      <div className="m-4">
        <p>
          Hemos actualizado tu password, seras redireccionado al login en 5
          segundos...
        </p>
      </div>
    )
  }

  if (
    recoveryPasswordQuery.called &&
    recoveryPasswordQuery.data?.getRecoveryEmail
  ) {
    return (
      <div className="m-4">
        <p>
          Hemos enviado un correo con instrucciones para cambiar tu password...
        </p>
        <p>Por favor revisa tu SPAM en caso que no lo encuentres...</p>
      </div>
    )
  }

  return (
    <div className="m-4">
      {recoveryId ? (
        <Formik
          initialValues={recoveryValues}
          validationSchema={recoverySchema}
          onSubmit={({ password }) => {
            updatePassword({
              variables: {
                recoveryId,
                password,
              },
            })
          }}
        >
          {(formik) => (
            // @ts-ignore: Unreachable code error
            <Form>
              <p>
                Ingresa tu nuevo password, recuerda que debe ser un numero de
                cuatro digitos, como 1111, o 1423...
              </p>
              <Field
                label="password"
                name="password"
                type="text"
                //@ts-ignore
                maxlength="4"
                errors={formik.errors}
              />
              <p></p>
              <Field
                //@ts-ignore
                maxlength="4"
                label="Repite tu password"
                name="repeatPassword"
                type="text"
                errors={formik.errors}
              />
              <p></p>
              <Button
                title="Cambiar password"
                className="mx-auto my-2"
                loading={
                  recoveryPasswordQuery?.loading || updatePasswordQuery?.loading
                }
              />
            </Form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={({ email }) => {
            recoverPassword({
              variables: {
                email,
              },
            })
          }}
        >
          {(formik) => (
            // @ts-ignore: Unreachable code error
            <Form>
              <h3>No recuerdo mi contraseña!</h3>
              <p>
                Si no recuerdas tu contraseña por favor confirma que el correo
                con que te diste de alta este bien escrito, nosotros te
                enviaremos una contraseña nueva.
              </p>
              {/*// @ts-ignore: Unreachable code error*/}
              <Field
                label="Correo electronico"
                name="email"
                type="text"
                errors={formik.errors}
              />
              <p />
              <Button
                title="Recuperar mi contraseña"
                className="mx-auto my-2"
              />
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
      )}
    </div>
  )
}
