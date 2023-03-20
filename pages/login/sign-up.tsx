import Field from "/components/Field"
import { Formik, Form, FieldArray } from "formik"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { CREATE_USER, LOG_IN, IS_LOGGED } from "./queries.gql"
import Layout from "./Layout"
import { createUser, addProperties, makePayment } from "../schema"

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
          placeholder="Roberto Jirafales"
          name="name"
          type="text"
          errors={formik.errors}
        />
        <Field
          label="Correo electronico"
          placeholder="roberto@gmail.com"
          name="email"
          type="text"
          errors={formik.errors}
        />
        <Field
          label="Telefono celular (usar el mismo que en el chat)"
          placeholder="9931000000"
          name="phone"
          type="text"
          errors={formik.errors}
        />
        <Field
          label="Pin (4 digitos)"
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

const AddProperties = ({ goBack, goNext, data, final }) => {
  const [signUpMutation, signUpMutationData] = useMutation(CREATE_USER)
  const [loginMutation, loginMutationData] = useMutation(LOG_IN, {
    refetchQueries: [{ query: IS_LOGGED }],
  })

  return (
    <Layout>
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
            initialErrors={true}
            render={(arrayProps) => (
              <Form>
                <div className="row">
                  <div className="twelve columns">
                    <h4>2. Agrege sus propiedades</h4>

                    {formik?.values.properties.length > 0 &&
                      formik?.values.properties.map((property, index) => {
                        const {
                          errors: { properties: errors },
                        } = arrayProps.form
                        console.log("arrayProps ", errors)
                        return (
                          <div className="twelve columns flex-end" key={index}>
                            <div className="four columns">
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
                              {errors?.[index]?.square && (
                                <p className="error">{errors[index].square}</p>
                              )}
                            </div>
                            <div className="four columns">
                              <Field
                                as="select"
                                name={`properties[${index}].lot`}
                                label="Lote"
                              >
                                {[...Array(20).keys()].map((i) => (
                                  <option key={i} value={i ? i : ""}>
                                    {i}
                                  </option>
                                ))}
                              </Field>
                              {errors?.[index]?.lot && (
                                <p className="error">{errors[index].lot}</p>
                              )}
                            </div>

                            <div className="two columns">
                              {formik.values.properties.length - 1 === index &&
                              !arrayProps.form.errors.properties?.[index] ? (
                                <button
                                  className="button-primary"
                                  value="Agregar propiedad"
                                  onClick={() =>
                                    arrayProps.push({ lot: "", square: "" })
                                  }
                                >
                                  Agregar propiedad
                                </button>
                              ) : (
                                index !== 0 &&
                                index ===
                                  formik.values.properties.length - 1 && (
                                  <button
                                    className="button-primary"
                                    value="Agregar propiedad"
                                    onClick={() => arrayProps.pop()}
                                  >
                                    Quitar propiedad
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
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
    </Layout>
  )
}

const MakePayment = ({ goBack, goNext, data, final }) => (
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
      <Form console={console.log(">>> ", formik)}>
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

export default function () {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setStep] = useState(0)

  const [data, setData] = useState({})

  const goBack = () => {
    console.log("go back")
    if (currentStep >= 1) {
      setStep(currentStep - 1)
    }
  }

  const goNext = (props) => {
    console.log("go next")
    setStep(currentStep + 1)
    setData({ ...data, ...props })
  }

  const steps = [
    <CreateUser goNext={goNext} goBack={goBack} data={data} />,
    <AddProperties goNext={goNext} goBack={goBack} data={data} final={true} />,
  ]

  return (
    <div className="row">
      <p>
        Paso {currentStep + 1} de {steps.length}
      </p>

      {steps[currentStep]}
    </div>
  )
}
