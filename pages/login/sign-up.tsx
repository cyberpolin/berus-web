import Field from "@/components/Field"
import { Formik, Form, FieldArray } from "formik"
import { useRouter } from "next/router"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { CREATE_USER, LOG_IN, IS_LOGGED } from "./queries.gql"

import { createUser, addProperties, makePayment } from "../schema"
import Layout from "@/components/layout/login"
import Button from "@/components/Button"
// @ts-ignore: Unreachable code error
const CreateUser = ({ goNext, goBack, data, final }) => (
  <div>
    <span className=" text-sm">Paso 1 de 2</span>
    <h3 className="text-2xl">Hola!</h3>
    <p className="mb-2 mt-2">
      Si eres residente de Cumbres 7 en Altozano Tabasco, llegaste al lugar
      indicado para llevar un seguimiento de tus pagos y un historial de los
      mismos.
    </p>
    <p className="mb-2 mt-2">
      Manten tus aportaciones al día y sigue recibiendo todos los servicios
    </p>

    <h4 className="text-xl">1. Crear un usuario</h4>
    <p className="mb-2 mt-2">
      Para poder relacionar tus propiedades crea un usuario, por favor usa el
      celular que tienes en whats app.
    </p>

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
        <Form className="text-center">
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

          <Button title="Crear usuario" />
        </Form>
      )}
    </Formik>
  </div>
)

// @ts-ignore: Unreachable code error
const AddProperties = ({ goNext, data, final }) => {
  const [signUpMutation, signUpMutationData] = useMutation(CREATE_USER)
  const [loginMutation, loginMutationData] = useMutation(LOG_IN, {
    refetchQueries: [{ query: IS_LOGGED }],
  })

  return (
    <div>
      <h4>2. Agrege sus propiedades</h4>
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
                <div className="w-full">
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
                    {/* @ts-ignore: Unreachable code error */}
                    {errors?.[index]?.square && (
                      // @ts-ignore: Unreachable code error
                      <p className="error">{errors[index].square}</p>
                    )}
                  </div>
                  <div className="twelve columns">
                    {formik?.values.properties.length > 0 &&
                      // @ts-ignore: Unreachable code error
                      formik?.values.properties.map((property, index) => {
                        const {
                          errors: { properties: errors },
                        } = arrayProps.form
                        return <h1 key={index}>test</h1>
                      })}
                  </div>
                  <Button title="Agregar Propiedades" />
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
  const [currentStep, setStep] = useState(1)

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

  console.log("currentStep ", currentStep)
  console.log("steps ", steps)
  console.log("steps >>  ", steps[currentStep])
  return (
    // @ts-ignore: Unreachable code error
    <Layout>{steps[currentStep]}</Layout>
  )
}

export default SignUp


// <>
// <div className="twelve columns flex-end" key={index}>
// <div className="four columns">
//   <Field
//   {/* // @ts-ignore: Unreachable code error */}
//   as="select"
//   name={`properties[${index}].square`}
//   label="Manzana"
//   >
//     <option value="">0</option>
//     <option value="1">1</option>
//     <option value="2">2</option>
//     <option value="3">3</option>
//     <option value="4">4</option>
//     <option value="5">5</option>
//     <option value="6">6</option>
//     <option value="7">7</option>
//     <option value="8">8</option>
//     <option value="9">9</option>
//   </Field>
//   {/* @ts-ignore: Unreachable code error */}
//   {errors?.[index]?.square && (
//     // @ts-ignore: Unreachable code error
//     <p className="error">{errors[index].square}</p>
//     )}
// </div>
// <div className="four columns">
//   <Field
//     {/* // @ts-ignore: Unreachable code error */}
//     as="select"
//     name={`properties[${index}].lot`}
//     label="Lote"
//     >
//     {
//       // @ts-ignore: Unreachable code error
//       [...Array(20).keys()].map((i) => (
//         <option key={i} value={i ? i : ""}>
//           {i}
//         </option>
//       ))
//     }
//   </Field>
//   {
//     // @ts-ignore: Unreachable code error
//     errors?.[index]?.lot && (
//       <p className="error">
//         {
//           // @ts-ignore: Unreachable code error
//           errors[index].lot
//         }
//       </p>
//     )
//   }
// </div>

// <div className="two columns">
//   {
//     // @ts-ignore: Unreachable code error
//     formik.values.properties.length - 1 === index && !arrayProps.form.errors.properties?.[index] ? (
//       <button
//         className="button-primary"
//         value="Agregar propiedad"
//         onClick={() =>
//           arrayProps.push({ lot: "", square: "" })
//         }
//       >
//         Agregar propiedad
//       </button>
//     ) : (
//       index !== 0 &&
//       index ===
//         formik.values.properties.length - 1 && (
//         <button
//           className="button-primary"
//           value="Agregar propiedad"
//           onClick={() => arrayProps.pop()}
//         >
//           Quitar propiedad
//         </button>
//       )
//     )
//   }
// </div>
// </div>

// </>