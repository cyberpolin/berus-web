import Field from "@/components/Field"
import { Formik, Form, FieldArray } from "formik"
import { useRouter } from "next/router"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { CREATE_USER, LOG_IN, IS_LOGGED } from "./queries.gql"

import { createUser, addProperties, makePayment } from "../schema"
import Layout from "@/components/layout/login"
// @ts-ignore: Unreachable code error
const CreateUser = ({ goNext, goBack, data, final }) => (
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
          Si eres residente de Cumbres 7 en Altozano Tabasco, llegaste al lugar
          indicado para llevar un seguimiento de tus pagos y un historial de los
          mismos.
        </p>
        <p>
          Manten tus aportaciones al día y sigue recibiendo todos los servicios
        </p>

        <h4>1. Crear un usuario</h4>
        <p>
          Para poder relacionar tus propiedades crea un usuario, por favor usa
          el celular que tienes en whats app.
        </p>

        <Field
          label="Nombre completo"
          // @ts-ignore: Unreachable code error
          placeholder="Roberto Jirafales"
          name="name"
          type="text"
          errors={formik.errors}
        />
        <Field
          label="Correo electronico"
          // @ts-ignore: Unreachable code error
          placeholder="roberto@gmail.com"
          name="email"
          type="text"
          errors={formik.errors}
        />
        <Field
          label="Telefono celular (usar el mismo que en el chat)"
          // @ts-ignore: Unreachable code error
          placeholder="9931000000"
          name="phone"
          type="text"
          errors={formik.errors}
        />
        <Field
          label="Pin (4 digitos)"
          // @ts-ignore: Unreachable code error
          placeholder="0000"
          name="password"
          type="text"
          errors={formik.errors}
        />

        <button
          className={`button-primary ${false && "loading"}`}
          type="submit"
          value="Ingresar"
        >
          Crear usuario
        </button>
      </Form>
    )}
  </Formik>
)

// @ts-ignore: Unreachable code error
const AddProperties = ({ goNext, data, final }) => {
  const [signUpMutation, signUpMutationData] = useMutation(CREATE_USER)
  const [loginMutation, loginMutationData] = useMutation(LOG_IN, {
    refetchQueries: [{ query: IS_LOGGED }],
  })

  return (
    <div>
      <Formik
        initialValues={{ ...data, properties: [{ lot: "", square: "" }] }}
        initialErrors={{
          properties: [{ lot: "required", square: "required" }],
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
            console.log("error ", error)
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
                <div className="row">
                  <div className="twelve columns">
                    <h4>2. Agrege sus propiedades</h4>

                    {formik?.values.properties.length > 0 &&
                      // @ts-ignore: Unreachable code error
                      formik?.values.properties.map((property, index) => {
                        const {
                          errors: { properties: errors },
                        } = arrayProps.form
                        return <h1 key={index}>test</h1>
                      })}
                  </div>
                  <button
                    className="button-primary"
                    type="submit"
                    value="Agregar propiedad"
                  >
                    Hacer el primer pago
                  </button>
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
        console.log("submit", data)
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

          <button className={`button-primary ${false && "loading"}`}>
            Hacer mi primer pagos
          </button>
        </div>
      </Form>
    )}
  </Formik>
)

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setStep] = useState(0)

  const [data, setData] = useState({})

  const goBack = () => {
    if (currentStep >= 1) {
      setStep(currentStep - 1)
    }
  }

  // @ts-ignore: Unreachable code error
  const goNext = (props) => {
    setStep(currentStep + 1)
    setData({ ...data, ...props })
  }

  const steps = [
    // @ts-ignore: Unreachable code error
    <CreateUser key={1} goNext={goNext} goBack={goBack} data={data} />,
    <AddProperties key={2} goNext={goNext} data={data} final={true} />,
  ]

  return (
    <Layout>
      <div className="row">
        <p>
          Paso {currentStep + 1} de {steps.length}
        </p>
        <>{steps[currentStep]}</>
      </div>
    </Layout>
  )
}

export default SignUp