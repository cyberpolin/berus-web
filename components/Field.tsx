import { Field } from "formik"

type FieldProps = {
  label?: string
  value?: string
  name: string
  errors?: any
  className?: string
  id: string
  type: string
}

export default function (props: FieldProps) {
  return (
    <>
      {props.label && (
        <label className="mb-1 mt-3 text-left text-gray-800" htmlFor="password">
          {props.label}
        </label>
      )}
      <Field
        className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        {...props}
      />

      {props.errors && props.errors[props.name] && (
        <span className="mb-2 ml-1 inline-block text-left text-sm text-red-800">
          {props.errors[props.name]}
        </span>
      )}
    </>
  )
}
