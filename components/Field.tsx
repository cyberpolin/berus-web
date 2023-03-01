import { Field } from "formik"

type FieldProps = {
  label?: string
  value?: string
  className?: string
  id: string
  type: string
}

export default function (props: FieldProps) {
  return (
    <>
      {props.label && <label htmlFor="password">{props.label}</label>}
      <Field className="u-full-width" {...props} />
      {props.errors && props.errors[props.name] && (
        <p className="error">{props.errors[props.name]}</p>
      )}
    </>
  )
}
